import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (exists) throw new ConflictException('Email or username already in use');
    const password_hash = await bcrypt.hash(dto.password, 12);
    const user = this.users.create({
      email: dto.email, username: dto.username, full_name: dto.full_name,
      password_hash, university_id: dto.university_id, role: 'student',
    });
    await this.users.save(user);
    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password_hash')
      .where('u.email = :email', { email: dto.email })
      .getOne();
    if (!user || !user.is_active) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user) return { ok: true }; // do not leak existence
    const token = randomBytes(32).toString('hex');
    user.reset_token = await bcrypt.hash(token, 10);
    user.reset_token_expires_at = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await this.users.save(user);
    // In production: send via email service. For now, return for dev.
    return { ok: true, dev_token: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const candidates = await this.users.find({
      where: { reset_token_expires_at: MoreThan(new Date()) },
    });
    let target: User | null = null;
    for (const u of candidates) {
      if (u.reset_token && (await bcrypt.compare(dto.token, u.reset_token))) { target = u; break; }
    }
    if (!target) throw new BadRequestException('Invalid or expired token');
    target.password_hash = await bcrypt.hash(dto.new_password, 12);
    target.reset_token = null; target.reset_token_expires_at = null;
    await this.users.save(target);
    return { ok: true };
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.cfg.get('JWT_SECRET'),
      expiresIn: this.cfg.get('JWT_EXPIRES_IN'),
    });
    const refresh_token = await this.jwt.signAsync(payload, {
      secret: this.cfg.get('JWT_REFRESH_SECRET'),
      expiresIn: this.cfg.get('JWT_REFRESH_EXPIRES_IN'),
    });
    return {
      access_token, refresh_token,
      user: { id: user.id, email: user.email, username: user.username, full_name: user.full_name, role: user.role },
    };
  }
}

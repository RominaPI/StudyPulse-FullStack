import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async login(dto: any) {
    // versión dummy (después conectas DB)
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken({
      id: '1',
      email: dto.email,
      role: 'student',
    });
  }

  async register(dto: any) {
    return this.signToken({
      id: '1',
      email: dto.email,
      role: 'student',
    });
  }

  async forgotPassword(dto: any) {
    return { ok: true, message: 'reset email sent' };
  }

  async resetPassword(dto: any) {
    return { ok: true, message: 'password updated' };
  }
}
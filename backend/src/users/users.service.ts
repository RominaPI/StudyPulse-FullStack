import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  findAll() { return this.repo.find(); }
  async findOne(id: string) {
    const u = await this.repo.findOne({ where: { id }, relations: ['university'] });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
  update(id: string, patch: Partial<User>) { return this.repo.update(id, patch).then(() => this.findOne(id)); }
  remove(id: string) { return this.repo.delete(id); }
}

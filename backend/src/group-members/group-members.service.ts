import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember, GroupRole } from '../database/entities/group-member.entity';
@Injectable()
export class GroupMembersService {
  constructor(@InjectRepository(GroupMember) private repo: Repository<GroupMember>) {}
  list(group_id: string) { return this.repo.find({ where: { group_id }, relations: ['user'] }); }
  async setRole(id: string, role: GroupRole) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException();
    m.role = role; return this.repo.save(m);
  }
  remove(id: string) { return this.repo.delete(id); }
}

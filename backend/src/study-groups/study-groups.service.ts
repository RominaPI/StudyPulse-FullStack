import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyGroup } from '../database/entities/study-group.entity';
import { GroupMember } from '../database/entities/group-member.entity';

@Injectable()
export class StudyGroupsService {
  constructor(
    @InjectRepository(StudyGroup) private groups: Repository<StudyGroup>,
    @InjectRepository(GroupMember) private members: Repository<GroupMember>,
  ) {}

  async create(owner_id: string, data: Partial<StudyGroup>) {
    const group = await this.groups.save(this.groups.create({ ...data, owner_id }));
    await this.members.save(this.members.create({ group_id: group.id, user_id: owner_id, role: 'owner' }));
    return group;
  }

  findAll() { return this.groups.find({ relations: ['subject', 'owner'] }); }

  async findOne(id: string) {
    const g = await this.groups.findOne({ where: { id }, relations: ['members', 'members.user', 'subject', 'owner'] });
    if (!g) throw new NotFoundException('Group not found');
    return g;
  }

  async join(group_id: string, user_id: string) {
    const group = await this.findOne(group_id);
    if (group.members.length >= group.max_members) throw new BadRequestException('Group is full');
    if (group.members.find((m) => m.user_id === user_id)) throw new BadRequestException('Already a member');
    return this.members.save(this.members.create({ group_id, user_id, role: 'member' }));
  }

  async leave(group_id: string, user_id: string) {
    const member = await this.members.findOne({ where: { group_id, user_id } });
    if (!member) throw new NotFoundException();
    if (member.role === 'owner') throw new ForbiddenException('Owner cannot leave');
    return this.members.remove(member);
  }

  async assertCanManage(group_id: string, user_id: string) {
    const m = await this.members.findOne({ where: { group_id, user_id } });
    if (!m || (m.role !== 'owner' && m.role !== 'admin'))
      throw new ForbiddenException('Insufficient group privileges');
  }

  remove(id: string) { return this.groups.delete(id); }
}

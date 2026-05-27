import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../database/entities/task.entity';
@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}
  create(created_by: string, data: Partial<Task>) { return this.repo.save(this.repo.create({ ...data, created_by })); }
  byGroup(group_id: string) { return this.repo.find({ where: { group_id }, relations: ['assignee'] }); }
  byUser(assignee_id: string) { return this.repo.find({ where: { assignee_id } }); }
  async update(id: string, p: Partial<Task>) {
    await this.repo.update(id, p);
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(); return t;
  }
  remove(id: string) { return this.repo.delete(id); }

  findAll() {
  return this.repo.find({
    order: {
      created_at: 'DESC',
    },
  });
}
}

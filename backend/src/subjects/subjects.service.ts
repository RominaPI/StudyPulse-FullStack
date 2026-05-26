import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../database/entities/subject.entity';
@Injectable()
export class SubjectsService {
  constructor(@InjectRepository(Subject) private repo: Repository<Subject>) {}
  create(data: Partial<Subject>) { return this.repo.save(this.repo.create(data)); }
  findByUniversity(university_id: string) { return this.repo.find({ where: { university_id } }); }
  findOne(id: string) { return this.repo.findOne({ where: { id }, relations: ['groups'] }); }
  update(id: string, p: Partial<Subject>) { return this.repo.update(id, p); }
  remove(id: string) { return this.repo.delete(id); }
}

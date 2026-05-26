import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from '../database/entities/university.entity';
@Injectable()
export class UniversitiesService {
  constructor(@InjectRepository(University) private repo: Repository<University>) {}
  create(data: Partial<University>) { return this.repo.save(this.repo.create(data)); }
  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } }); }
}

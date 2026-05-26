import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../database/entities/resource.entity';
@Injectable()
export class ResourcesService {
  constructor(@InjectRepository(Resource) private repo: Repository<Resource>) {}
  create(uploaded_by: string, data: Partial<Resource>) { return this.repo.save(this.repo.create({ ...data, uploaded_by })); }
  byGroup(group_id: string) { return this.repo.find({ where: { group_id }, relations: ['uploader'] }); }
  remove(id: string) { return this.repo.delete(id); }
}

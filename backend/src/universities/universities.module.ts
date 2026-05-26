import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from '../database/entities/university.entity';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
@Module({ imports: [TypeOrmModule.forFeature([University])], controllers: [UniversitiesController], providers: [UniversitiesService] })
export class UniversitiesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '../database/entities/resource.entity';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
@Module({ imports: [TypeOrmModule.forFeature([Resource])], controllers: [ResourcesController], providers: [ResourcesService] })
export class ResourcesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { Subject } from '../database/entities/subject.entity';
import { StudyGroup } from '../database/entities/study-group.entity';
import { Task } from '../database/entities/task.entity';
import { GroupMember } from '../database/entities/group-member.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, StudyGroup, Task, GroupMember]),
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyGroup } from '../database/entities/study-group.entity';
import { GroupMember } from '../database/entities/group-member.entity';
import { StudyGroupsService } from './study-groups.service';
import { StudyGroupsController } from './study-groups.controller';
@Module({
  imports: [TypeOrmModule.forFeature([StudyGroup, GroupMember])],
  controllers: [StudyGroupsController],
  providers: [StudyGroupsService],
  exports: [StudyGroupsService],
})
export class StudyGroupsModule {}

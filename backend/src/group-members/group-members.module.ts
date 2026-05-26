import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from '../database/entities/group-member.entity';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}

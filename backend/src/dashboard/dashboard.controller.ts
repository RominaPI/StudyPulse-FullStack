import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../database/entities/subject.entity';
import { StudyGroup } from '../database/entities/study-group.entity';
import { Task } from '../database/entities/task.entity';
import { GroupMember } from '../database/entities/group-member.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
 
@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepo: Repository<Subject>,
 
    @InjectRepository(StudyGroup)
    private groupsRepo: Repository<StudyGroup>,
 
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
 
    @InjectRepository(GroupMember)
    private membersRepo: Repository<GroupMember>,
  ) {}
 
  @Get('stats')
  async stats(@CurrentUser('id') userId: string) {
    // Subjects created by this user
    const subjects = await this.subjectsRepo.count({
      where: { owner_id: userId },
    });
 
    // Groups the user is a member of
    const groups = await this.membersRepo.count({
      where: { user_id: userId },
    });
 
    // Active tasks created by or assigned to this user
    const tasks = await this.tasksRepo
      .createQueryBuilder('task')
      .where(
        '(task.created_by = :uid OR task.assignee_id = :uid) AND task.status != :done',
        { uid: userId, done: 'done' },
      )
      .getCount();
 
    return { groups, subjects, tasks, focusMinutes: 0 };
  }
}
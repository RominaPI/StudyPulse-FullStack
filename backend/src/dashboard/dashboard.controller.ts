import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from '../database/entities/subject.entity';
import { StudyGroup } from '../database/entities/study-group.entity';
import { Task } from '../database/entities/task.entity';

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
  ) {}

  @Get('stats')
  async stats() {

    const subjects = await this.subjectsRepo.count();

    const groups = await this.groupsRepo.count();

    const tasks = await this.tasksRepo.count({
      where: {
        status: 'todo',
      },
    });

    return {
      groups,
      subjects,
      tasks,
      focusMinutes: 0,
    };
  }
}
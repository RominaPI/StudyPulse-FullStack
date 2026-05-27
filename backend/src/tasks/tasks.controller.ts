import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { TasksService } from './tasks.service';

class CreateTaskDto {

  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsIn([
    'low',
    'medium',
    'high',
    'urgent',
  ])
  priority?: any;

  @IsOptional()
  @IsIn([
    'todo',
    'in_progress',
    'review',
    'done',
  ])
  status?: any;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsUUID()
  group_id?: string;

  @IsOptional()
  @IsUUID()
  assignee_id?: string;
}

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {

  constructor(
    private svc: TasksService,
  ) {}

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Post()
  create(
    @Body()
    dto: CreateTaskDto,
  ) {
    return this.svc.create(null, {
      ...dto,
      due_date: dto.due_date
        ? new Date(dto.due_date)
        : undefined,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    body: any,
  ) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.svc.remove(id);
  }
}
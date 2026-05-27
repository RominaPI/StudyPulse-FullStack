import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import {
  IsString,
  MaxLength,
  IsOptional,
  IsObject,
  IsInt,
} from 'class-validator';

import { SubjectsService } from './subjects.service';

class CreateSubjectDto {
  @IsString()
  @MaxLength(30)
  code: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  professor?: string;

  @IsOptional()
  @IsInt()
  credits?: number;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;
}

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
  constructor(private svc: SubjectsService) {}

  @Get()
  findAll(@Query('university_id') uni?: string) {
    return this.svc.findByUniversity(uni);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSubjectDto) {
    return this.svc.create(dto);
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
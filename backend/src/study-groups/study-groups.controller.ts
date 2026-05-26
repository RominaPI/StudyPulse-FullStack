import { Body, Controller, Get, Param, Post, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { StudyGroupsService } from './study-groups.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateGroupDto {
  @IsString() @MaxLength(120) name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsBoolean() is_private?: boolean;
  @IsOptional() @IsInt() @Min(2) @Max(100) max_members?: number;
  @IsOptional() @IsUUID() subject_id?: string;
}

@ApiTags('study-groups') @ApiBearerAuth() @Controller('study-groups')
export class StudyGroupsController {
  constructor(private svc: StudyGroupsService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.findOne(id); }
  @Post() create(@CurrentUser('id') uid: string, @Body() dto: CreateGroupDto) { return this.svc.create(uid, dto); }
  @Post(':id/join') join(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') uid: string) { return this.svc.join(id, uid); }
  @Delete(':id/leave') leave(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') uid: string) { return this.svc.leave(id, uid); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') uid: string) {
    return this.svc.assertCanManage(id, uid).then(() => this.svc.remove(id));
  }
}

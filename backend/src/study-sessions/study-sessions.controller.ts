import { Body, Controller, Get, Param, Post, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { StudySessionsService } from './study-sessions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class ScheduleDto {
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsString() goal?: string;
  @IsDateString() starts_at: string;
  @IsOptional() @IsInt() @Min(5) @Max(240) duration_minutes?: number;
  @IsUUID() group_id: string;
}
class FocusDto { @IsInt() @Min(1) @Max(240) focus_minutes: number; }

@ApiTags('study-sessions') @ApiBearerAuth() @Controller('study-sessions')
export class StudySessionsController {
  constructor(private svc: StudySessionsService) {}
  @Get() list(@Query('group_id', ParseUUIDPipe) g: string) { return this.svc.byGroup(g); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.findOne(id); }
  @Post() schedule(@CurrentUser('id') uid: string, @Body() dto: ScheduleDto) { return this.svc.schedule(uid, dto); }
  @Post(':id/check-in') checkIn(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') uid: string) { return this.svc.checkIn(id, uid); }
  @Post(':id/focus') focus(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') uid: string, @Body() dto: FocusDto) { return this.svc.logFocus(id, uid, dto.focus_minutes); }
}

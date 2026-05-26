import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { StressLogsService } from './stress-logs.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateStressLogDto {
  @IsInt() @Min(1) @Max(10) stress_level: number;
  @IsInt() @Min(1) @Max(10) mood: number;
  @IsOptional() @IsString() @MaxLength(500) notes?: string;
  @IsOptional() @IsArray() factors?: string[];
}
@ApiTags('stress-logs') @ApiBearerAuth() @Controller('stress-logs')
export class StressLogsController {
  constructor(private svc: StressLogsService) {}
  @Get() mine(@CurrentUser('id') uid: string, @Query('days') d?: string) { return this.svc.recent(uid, d ? +d : 30); }
  @Post() log(@CurrentUser('id') uid: string, @Body() dto: CreateStressLogDto) { return this.svc.log(uid, dto); }
}

import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { FeedService } from './feed.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreatePostDto {
  @IsString() @MaxLength(2000) content: string;
  @IsOptional() @IsString() group_id?: string;
  @IsOptional() @IsIn(['post', 'resource', 'achievement', 'announcement']) type?: any;
  @IsOptional() @IsArray() tags?: string[];
}

@ApiTags('feed') @ApiBearerAuth() @Controller('feed')
export class FeedController {
  constructor(private svc: FeedService) {}
  @Get() list(@Query('group_id') g?: string, @Query('author_id') a?: string, @Query('limit') l?: string, @Query('skip') s?: string) {
    return this.svc.list({ ...(g && { group_id: g }), ...(a && { author_id: a }) }, l ? +l : 30, s ? +s : 0);
  }
  @Post() create(@CurrentUser('id') uid: string, @Body() dto: CreatePostDto) { return this.svc.create(uid, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}

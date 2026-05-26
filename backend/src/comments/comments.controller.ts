import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CommentsService } from './comments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateCommentDto {
  @IsString() post_id: string;
  @IsString() @MaxLength(1000) content: string;
  @IsOptional() @IsString() parent_id?: string;
}

@ApiTags('comments') @ApiBearerAuth() @Controller('comments')
export class CommentsController {
  constructor(private svc: CommentsService) {}
  @Get() list(@Query('post_id') p: string) { return this.svc.byPost(p); }
  @Post() create(@CurrentUser('id') uid: string, @Body() dto: CreateCommentDto) {
    return this.svc.create(uid, dto.post_id, dto.content, dto.parent_id);
  }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}

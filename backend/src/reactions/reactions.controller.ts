import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { ReactionsService } from './reactions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class ToggleDto {
  @IsString() target_id: string;
  @IsIn(['post', 'comment', 'message']) target_type: 'post' | 'comment' | 'message';
  @IsString() emoji: string;
}
@ApiTags('reactions') @ApiBearerAuth() @Controller('reactions')
export class ReactionsController {
  constructor(private svc: ReactionsService) {}
  @Get(':target_id') list(@Param('target_id') id: string) { return this.svc.list(id); }
  @Post('toggle') toggle(@CurrentUser('id') uid: string, @Body() dto: ToggleDto) {
    return this.svc.toggle(uid, dto.target_id, dto.target_type, dto.emoji);
  }
}

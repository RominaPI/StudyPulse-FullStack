import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('chat') @ApiBearerAuth() @Controller('chat')
export class ChatController {
  constructor(private svc: ChatService) {}
  @Get('group/:groupId')
  groupHistory(@Param('groupId') id: string, @Query('limit') limit?: string) {
    return this.svc.history(id, limit ? +limit : 50);
  }
  @Get('dm/:otherId')
  dmHistory(@CurrentUser('id') me: string, @Param('otherId') other: string) {
    return this.svc.history(ChatService.dmChannelId(me, other));
  }
}

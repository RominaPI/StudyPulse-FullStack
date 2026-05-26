import { Controller, Get, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('notifications') @ApiBearerAuth() @Controller('notifications')
export class NotificationsController {
  constructor(private svc: NotificationsService) {}
  @Get() mine(@CurrentUser('id') uid: string) { return this.svc.forUser(uid); }
  @Patch(':id/read') read(@Param('id', ParseUUIDPipe) id: string) { return this.svc.markRead(id); }
}

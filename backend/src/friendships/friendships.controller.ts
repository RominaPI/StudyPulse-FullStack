import { Body, Controller, Get, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';
import { FriendshipsService } from './friendships.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class RequestDto { @IsUUID() addressee_id: string; }
class RespondDto { @IsBoolean() accept: boolean; }

@ApiTags('friendships') @ApiBearerAuth() @Controller('friendships')
export class FriendshipsController {
  constructor(private svc: FriendshipsService) {}
  @Get() mine(@CurrentUser('id') uid: string) { return this.svc.list(uid); }
  @Post() request(@CurrentUser('id') uid: string, @Body() dto: RequestDto) { return this.svc.request(uid, dto.addressee_id); }
  @Patch(':id') respond(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RespondDto) { return this.svc.respond(id, dto.accept); }
}

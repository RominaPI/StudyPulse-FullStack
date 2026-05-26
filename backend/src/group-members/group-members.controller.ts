import { Body, Controller, Delete, Get, Param, Patch, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { GroupMembersService } from './group-members.service';

class UpdateRoleDto { @IsIn(['owner', 'admin', 'member']) role: 'owner' | 'admin' | 'member'; }

@ApiTags('group-members') @ApiBearerAuth() @Controller('group-members')
export class GroupMembersController {
  constructor(private svc: GroupMembersService) {}
  @Get() list(@Query('group_id', ParseUUIDPipe) g: string) { return this.svc.list(g); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) { return this.svc.setRole(id, dto.role); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string) { return this.svc.remove(id); }
}

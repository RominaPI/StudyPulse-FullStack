import { Body, Controller, Delete, Get, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@ApiTags('users') @ApiBearerAuth() @Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() @UseGuards(RolesGuard) @Roles('admin') findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.findOne(id); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) { return this.svc.update(id, body); }
  @Delete(':id') @UseGuards(RolesGuard) @Roles('admin') remove(@Param('id', ParseUUIDPipe) id: string) { return this.svc.remove(id); }
}

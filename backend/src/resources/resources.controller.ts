import { Body, Controller, Delete, Get, Param, Post, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';
import { ResourcesService } from './resources.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateResourceDto {
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsString() description?: string;
  @IsUrl() url: string;
  @IsOptional() @IsString() type?: string;
  @IsUUID() group_id: string;
}
@ApiTags('resources') @ApiBearerAuth() @Controller('resources')
export class ResourcesController {
  constructor(private svc: ResourcesService) {}
  @Get() list(@Query('group_id', ParseUUIDPipe) g: string) { return this.svc.byGroup(g); }
  @Post() create(@CurrentUser('id') uid: string, @Body() dto: CreateResourceDto) { return this.svc.create(uid, dto); }
  @Delete(':id') remove(@Param('id', ParseUUIDPipe) id: string) { return this.svc.remove(id); }
}

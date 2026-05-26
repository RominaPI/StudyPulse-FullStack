import { Body, Controller, Get, Param, Post, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { UniversitiesService } from './universities.service';
import { Public } from '../common/decorators/public.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class CreateUniversityDto {
  @IsString() @MaxLength(200) name: string;
  @IsString() @MaxLength(10) country_code: string;
}
@ApiTags('universities') @ApiBearerAuth() @Controller('universities')
export class UniversitiesController {
  constructor(private svc: UniversitiesService) {}
  @Public() @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id', ParseUUIDPipe) id: string) { return this.svc.findOne(id); }
  @Post() @UseGuards(RolesGuard) @Roles('admin') create(@Body() dto: CreateUniversityDto) { return this.svc.create(dto); }
}

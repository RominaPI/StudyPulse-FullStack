import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySession } from '../database/entities/study-session.entity';
import { SessionAttendance } from '../database/entities/session-attendance.entity';
import { StudySessionsService } from './study-sessions.service';
import { StudySessionsController } from './study-sessions.controller';
@Module({
  imports: [TypeOrmModule.forFeature([StudySession, SessionAttendance])],
  controllers: [StudySessionsController],
  providers: [StudySessionsService],
})
export class StudySessionsModule {}

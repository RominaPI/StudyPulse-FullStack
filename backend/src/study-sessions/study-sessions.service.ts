import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudySession } from '../database/entities/study-session.entity';
import { SessionAttendance } from '../database/entities/session-attendance.entity';

@Injectable()
export class StudySessionsService {
  constructor(
    @InjectRepository(StudySession) private sessions: Repository<StudySession>,
    @InjectRepository(SessionAttendance) private att: Repository<SessionAttendance>,
  ) {}
  schedule(host_id: string, data: Partial<StudySession>) {
    return this.sessions.save(this.sessions.create({ ...data, host_id }));
  }
  byGroup(group_id: string) {
    return this.sessions.find({ where: { group_id }, relations: ['attendances'], order: { starts_at: 'ASC' } });
  }
  async findOne(id: string) {
    const s = await this.sessions.findOne({ where: { id }, relations: ['attendances', 'attendances.user'] });
    if (!s) throw new NotFoundException(); return s;
  }
  async checkIn(session_id: string, user_id: string) {
    const existing = await this.att.findOne({ where: { session_id, user_id } });
    if (existing) { existing.status = 'attended'; return this.att.save(existing); }
    return this.att.save(this.att.create({ session_id, user_id, status: 'attended' }));
  }
  async logFocus(session_id: string, user_id: string, focus_minutes: number) {
    const a = await this.att.findOne({ where: { session_id, user_id } });
    if (!a) throw new NotFoundException();
    a.focus_minutes += focus_minutes; return this.att.save(a);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private repo: Repository<Notification>) {}
  push(user_id: string, type: string, title: string, body: string, data?: any) {
    return this.repo.save(this.repo.create({ user_id, type, title, body, data }));
  }
  forUser(user_id: string) { return this.repo.find({ where: { user_id }, order: { created_at: 'DESC' }, take: 100 }); }
  markRead(id: string) { return this.repo.update(id, { read: true }); }
}

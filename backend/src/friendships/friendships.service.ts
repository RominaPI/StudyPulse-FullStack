import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../database/entities/friendship.entity';
@Injectable()
export class FriendshipsService {
  constructor(@InjectRepository(Friendship) private repo: Repository<Friendship>) {}
  async request(requester_id: string, addressee_id: string) {
    if (requester_id === addressee_id) throw new BadRequestException();
    const exists = await this.repo.findOne({ where: { requester_id, addressee_id } });
    if (exists) return exists;
    return this.repo.save(this.repo.create({ requester_id, addressee_id, status: 'pending' }));
  }
  async respond(id: string, accepted: boolean) {
    const f = await this.repo.findOne({ where: { id } });
    if (!f) throw new NotFoundException();
    f.status = accepted ? 'accepted' : 'blocked'; return this.repo.save(f);
  }
  list(user_id: string) {
    return this.repo.find({ where: [{ requester_id: user_id }, { addressee_id: user_id }] });
  }
}

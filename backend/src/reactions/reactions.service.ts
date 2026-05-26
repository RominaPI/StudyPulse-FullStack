import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from '../mongo/schemas/reaction.schema';
import { FeedService } from '../feed/feed.service';

@Injectable()
export class ReactionsService {
  constructor(@InjectModel(Reaction.name) private model: Model<ReactionDocument>, private feed: FeedService) {}
  async toggle(user_id: string, target_id: string, target_type: string, emoji: string) {
    const existing = await this.model.findOne({ user_id, target_id, emoji });
    if (existing) {
      await existing.deleteOne();
      if (target_type === 'post') await this.feed.incrementCounter(target_id, 'reactions_count', -1);
      return { removed: true };
    }
    try {
      const r = await this.model.create({ user_id, target_id, target_type, emoji });
      if (target_type === 'post') await this.feed.incrementCounter(target_id, 'reactions_count', 1);
      return r;
    } catch { throw new ConflictException(); }
  }
  list(target_id: string) { return this.model.find({ target_id }).lean(); }
}

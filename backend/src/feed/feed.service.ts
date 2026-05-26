import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityFeed, ActivityFeedDocument } from '../mongo/schemas/activity-feed.schema';

@Injectable()
export class FeedService {
  constructor(@InjectModel(ActivityFeed.name) private model: Model<ActivityFeedDocument>) {}
  create(author_id: string, data: Partial<ActivityFeed>) { return this.model.create({ ...data, author_id }); }
  list(filter: { group_id?: string; author_id?: string } = {}, limit = 30, skip = 0) {
    return this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  }
  remove(id: string) { return this.model.findByIdAndDelete(id); }
  incrementCounter(id: string, field: 'reactions_count' | 'comments_count', delta: number) {
    return this.model.findByIdAndUpdate(id, { $inc: { [field]: delta } });
  }
}

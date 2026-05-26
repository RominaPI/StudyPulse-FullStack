import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../mongo/schemas/comment.schema';
import { FeedService } from '../feed/feed.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private model: Model<CommentDocument>,
    private feed: FeedService,
  ) {}
  async create(author_id: string, post_id: string, content: string, parent_id?: string) {
    const c = await this.model.create({ author_id, post_id, content, parent_id: parent_id ?? null });
    await this.feed.incrementCounter(post_id, 'comments_count', 1);
    return c;
  }
  byPost(post_id: string) { return this.model.find({ post_id }).sort({ createdAt: 1 }).lean(); }
  async remove(id: string) {
    const c = await this.model.findByIdAndDelete(id);
    if (c) await this.feed.incrementCounter(c.post_id, 'comments_count', -1);
    return c;
  }
}

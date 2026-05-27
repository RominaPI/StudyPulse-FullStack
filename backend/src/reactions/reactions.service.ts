import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Reaction,
  ReactionDocument,
} from '../mongo/schemas/reaction.schema';

import { FeedService } from '../feed/feed.service';

@Injectable()
export class ReactionsService {

  constructor(

    @InjectModel(Reaction.name)
    private model: Model<ReactionDocument>,

    private feedService: FeedService,

  ) {}

  async list(target_id: string) {

    return this.model.find({
      target_id,
    });

  }

  async toggle(
    user_id: string,
    target_id: string,
    target_type: 'post' | 'comment' | 'message',
    emoji: string,
  ) {

    const existing = await this.model.findOne({
      user_id,
      target_id,
      emoji,
    });

    // SI YA EXISTE -> quitar like
    if (existing) {

      await existing.deleteOne();

      if (target_type === 'post') {

        await this.feedService.incrementCounter(
          target_id,
          'reactions_count',
          -1,
        );

      }

      return {
        liked: false,
      };
    }

    // SI NO EXISTE -> agregar like
    await this.model.create({
      user_id,
      target_id,
      target_type,
      emoji,
    });

    if (target_type === 'post') {

      await this.feedService.incrementCounter(
        target_id,
        'reactions_count',
        1,
      );

    }

    return {
      liked: true,
    };
  }
}
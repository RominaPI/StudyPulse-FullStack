import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityFeed, ActivityFeedSchema } from '../mongo/schemas/activity-feed.schema';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: ActivityFeed.name, schema: ActivityFeedSchema }])],
  controllers: [FeedController], providers: [FeedService], exports: [FeedService],
})
export class FeedModule {}

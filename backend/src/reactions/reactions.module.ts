import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from '../mongo/schemas/reaction.schema';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { FeedModule } from '../feed/feed.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]), FeedModule],
  controllers: [ReactionsController], providers: [ReactionsService],
})
export class ReactionsModule {}

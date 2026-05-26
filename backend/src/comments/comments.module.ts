import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../mongo/schemas/comment.schema';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { FeedModule } from '../feed/feed.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), FeedModule],
  controllers: [CommentsController], providers: [CommentsService],
})
export class CommentsModule {}

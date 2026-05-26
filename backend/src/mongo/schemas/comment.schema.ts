import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ required: true, index: true }) post_id: string;
  @Prop({ required: true, index: true }) author_id: string;
  @Prop({ required: true }) content: string;
  @Prop({ default: null }) parent_id: string | null;
  @Prop({ default: false }) edited: boolean;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

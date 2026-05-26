import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityFeedDocument = HydratedDocument<ActivityFeed>;

@Schema({ timestamps: true, collection: 'activity_feed' })
export class ActivityFeed {
  @Prop({ required: true, index: true }) author_id: string;
  @Prop({ index: true }) group_id: string;
  @Prop({ required: true }) content: string;
  @Prop({ default: 'post' }) type: 'post' | 'resource' | 'achievement' | 'announcement';
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ type: Object, default: null }) attachment: Record<string, any> | null;
  @Prop({ type: Number, default: 0 }) reactions_count: number;
  @Prop({ type: Number, default: 0 }) comments_count: number;
}
export const ActivityFeedSchema = SchemaFactory.createForClass(ActivityFeed);
ActivityFeedSchema.index({ createdAt: -1 });

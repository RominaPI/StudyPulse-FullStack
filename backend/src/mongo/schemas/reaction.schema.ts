import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReactionDocument = HydratedDocument<Reaction>;

@Schema({ timestamps: true, collection: 'reactions' })
export class Reaction {
  @Prop({ required: true, index: true }) target_id: string;
  @Prop({ required: true, enum: ['post', 'comment', 'message'] }) target_type: string;
  @Prop({ required: true, index: true }) user_id: string;
  @Prop({ required: true }) emoji: string;
}
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.index({ target_id: 1, user_id: 1, emoji: 1 }, { unique: true });

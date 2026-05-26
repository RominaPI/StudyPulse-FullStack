import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema({ timestamps: true, collection: 'chat_messages' })
export class ChatMessage {
  @Prop({ required: true, index: true }) channel_id: string; // group_id or DM key
  @Prop({ required: true, enum: ['group', 'private'] }) channel_type: 'group' | 'private';
  @Prop({ required: true, index: true }) sender_id: string;
  @Prop({ required: true }) content: string;
  @Prop({ type: [String], default: [] }) mentions: string[];
  @Prop({ type: Object, default: {} }) attachments: Record<string, any>;
  @Prop({ default: false }) edited: boolean;
  @Prop({ default: null, type: Date }) deleted_at: Date | null;
}
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
ChatMessageSchema.index({ channel_id: 1, createdAt: -1 });

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage, ChatMessageDocument } from '../mongo/schemas/chat-message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private model: Model<ChatMessageDocument>) {}

  send(channel_id: string, channel_type: 'group' | 'private', sender_id: string, content: string, mentions: string[] = []) {
    return this.model.create({ channel_id, channel_type, sender_id, content, mentions });
  }
  history(channel_id: string, limit = 50, before?: Date) {
    const q: any = { channel_id, deleted_at: null };
    if (before) q.createdAt = { $lt: before };
    return this.model.find(q).sort({ createdAt: -1 }).limit(limit).lean();
  }
  static dmChannelId(a: string, b: string) {
    return [a, b].sort().join(':');
  }
}

import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/ws' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');
  private online = new Map<string, Set<string>>(); // userId -> sockets

  constructor(private chat: ChatService, private jwt: JwtService, private cfg: ConfigService) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token || client.handshake.headers?.authorization || '').replace('Bearer ', '');
      const payload = await this.jwt.verifyAsync(token, { secret: this.cfg.get('JWT_SECRET') });
      client.data.userId = payload.sub;
      const set = this.online.get(payload.sub) ?? new Set();
      set.add(client.id); this.online.set(payload.sub, set);
      this.server.emit('presence:update', { userId: payload.sub, online: true });
    } catch (e) {
      this.logger.warn(`Unauthorized socket: ${e.message}`); client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const uid = client.data.userId; if (!uid) return;
    const set = this.online.get(uid); if (!set) return;
    set.delete(client.id);
    if (!set.size) { this.online.delete(uid); this.server.emit('presence:update', { userId: uid, online: false }); }
  }

  @SubscribeMessage('join:room')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
    client.join(data.room); return { ok: true };
  }

  @SubscribeMessage('chat:send')
  async send(@ConnectedSocket() client: Socket, @MessageBody() data: {
    channel_id: string; channel_type: 'group' | 'private'; content: string; mentions?: string[];
  }) {
    const message = await this.chat.send(data.channel_id, data.channel_type, client.data.userId, data.content, data.mentions ?? []);
    this.server.to(data.channel_id).emit('chat:message', message);
    return message;
  }

  @SubscribeMessage('typing')
  typing(@ConnectedSocket() client: Socket, @MessageBody() data: { channel_id: string; typing: boolean }) {
    client.to(data.channel_id).emit('typing', { userId: client.data.userId, typing: data.typing });
  }
}

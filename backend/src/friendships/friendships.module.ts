import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from '../database/entities/friendship.entity';
import { FriendshipsService } from './friendships.service';
import { FriendshipsController } from './friendships.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Friendship])],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
})
export class FriendshipsModule {}

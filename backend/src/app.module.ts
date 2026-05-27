import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UniversitiesModule } from './universities/universities.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudyGroupsModule } from './study-groups/study-groups.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { TasksModule } from './tasks/tasks.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { ResourcesModule } from './resources/resources.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { ChatModule } from './chat/chat.module';
import { FeedModule } from './feed/feed.module';
import { CommentsModule } from './comments/comments.module';
import { ReactionsModule } from './reactions/reactions.module';
import { StressLogsModule } from './stress-logs/stress-logs.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: +cfg.get('DB_PORT'),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: cfg.get('DB_SYNC') === 'true',
        logging: cfg.get('NODE_ENV') === 'development' ? ['error', 'warn'] : false,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({ uri: cfg.get('MONGO_URI') }),
    }),
    AuthModule, UsersModule, UniversitiesModule, SubjectsModule,
    StudyGroupsModule, GroupMembersModule, TasksModule, StudySessionsModule,
    ResourcesModule, NotificationsModule, FriendshipsModule,
    ChatModule, FeedModule, CommentsModule, ReactionsModule, StressLogsModule, DashboardModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

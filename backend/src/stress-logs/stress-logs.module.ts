import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StressLog, StressLogSchema } from '../mongo/schemas/stress-log.schema';
import { StressLogsService } from './stress-logs.service';
import { StressLogsController } from './stress-logs.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: StressLog.name, schema: StressLogSchema }])],
  controllers: [StressLogsController], providers: [StressLogsService],
})
export class StressLogsModule {}

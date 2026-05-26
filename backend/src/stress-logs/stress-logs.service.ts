import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StressLog, StressLogDocument } from '../mongo/schemas/stress-log.schema';

@Injectable()
export class StressLogsService {
  constructor(@InjectModel(StressLog.name) private model: Model<StressLogDocument>) {}
  log(user_id: string, data: Partial<StressLog>) { return this.model.create({ ...data, user_id }); }
  recent(user_id: string, days = 30) {
    const since = new Date(Date.now() - days * 86400000);
    return this.model.find({ user_id, createdAt: { $gte: since } }).sort({ createdAt: -1 }).lean();
  }
}

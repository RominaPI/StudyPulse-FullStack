import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StressLogDocument = HydratedDocument<StressLog>;

@Schema({ timestamps: true, collection: 'stress_logs' })
export class StressLog {
  @Prop({ required: true, index: true }) user_id: string;
  @Prop({ required: true, min: 1, max: 10 }) stress_level: number;
  @Prop({ required: true, min: 1, max: 10 }) mood: number;
  @Prop() notes: string;
  @Prop({ type: [String], default: [] }) factors: string[];
}
export const StressLogSchema = SchemaFactory.createForClass(StressLog);
StressLogSchema.index({ user_id: 1, createdAt: -1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema()
export class Log {
  @Prop({ required: true })
  event: string;
  @Prop({ type: String, default: () => new Date().toISOString() })
  timestamp?: string;

  @Prop({ type: String, required: false })
  userId?: string;

  @Prop({ type: Number, required: false })
  resourceId?: number;
  @Prop({ type: Object, required: false })
  before?: Record<string, any>;

  @Prop({ type: Object, required: false })
  after?: Record<string, any>;

  @Prop({ type: String, required: false })
  message?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);

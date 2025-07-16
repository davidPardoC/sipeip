import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './schema/log.schema';
import { Model } from 'mongoose';

@Injectable()
export class LoggingService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {
    // Initialization logic if needed
  }

  logMessage(event: any): Promise<Log> {
    return this.logModel.create(event);
  }
}

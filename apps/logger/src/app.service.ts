import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './logging/schema/log.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  getHello(): string {
    return 'Hello World!';
  }

  getByCreatedBy(createdBy: string): Promise<JSON[]> {
    return this.logModel.find({ userId: createdBy });
  }
}

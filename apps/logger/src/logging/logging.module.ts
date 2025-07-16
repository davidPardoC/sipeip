import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingController } from './logging.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schema/log.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}

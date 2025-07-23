import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingModule } from './logging/logging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './logging/schema/log.schema';

@Module({
  imports: [
    LoggingModule,
    MongooseModule.forRoot(
      'mongodb://root:example@127.0.0.1:27017/logger?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

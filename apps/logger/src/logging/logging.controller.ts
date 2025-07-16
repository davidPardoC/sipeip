import { Controller } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageLogEvent } from './dtos/log-message.dto';

@Controller()
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @EventPattern('event-log-core')
  handleMessage(@Payload() message: MessageLogEvent) {
    return this.loggingService.logMessage(message);
  }
}

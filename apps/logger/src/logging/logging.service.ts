import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  logMessage(message: any): void {
    // Here you can implement your logging logic, e.g., save to a database or file
    console.log('Received message:', message);
  }
}

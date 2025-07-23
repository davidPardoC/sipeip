import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('by-created-by/:createdBy')
  getByCreatedBy(@Param('createdBy') createdBy: string): Promise<JSON[]> {
    return this.appService.getByCreatedBy(createdBy);
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('apple')
  getApple(): string {
    return 'Apple';
  }

  @Post()
  rootPostHello(): string {
    return 'HelloPost';
  }

  @Post('value')
  postHello(@Body('value') value): string {
    return value;
  }
}

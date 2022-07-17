import { Body, Controller, Get, Post } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Get('/a')
  async root() {
    return 'REDIS DB...';
  }

  @Post('/set')
  async setKey(
    @Body('key') key: string,
    @Body('value') value: string,
    @Body('ttl') ttl: number,
  ) {
    return await this.redisCacheService.setKey(key, value, ttl);
  }

  @Post('/get')
  async getKey(@Body('key') key: string) {
    return await this.redisCacheService.getKey(key);
  }

  @Post('/del')
  async delKey(@Body('key') key: string) {
    return await this.redisCacheService.delKey(key);
  }
}

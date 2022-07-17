import { CacheModule, Global, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { RedisCacheController } from './redis-cache.controller';
import * as redisStore from 'cache-manager-redis-store';

export const cacheModule = CacheModule.register({
  useFactory: () => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: 0,
    auth_pass: process.env.REDIS_PASSWORD,
  }),
});

@Global()
@Module({
  imports: [cacheModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
  controllers: [RedisCacheController],
})
export class RedisCacheModule {}

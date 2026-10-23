// redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService], // Export the service itself, no custom token needed anymore!
})
export class RedisModule {}

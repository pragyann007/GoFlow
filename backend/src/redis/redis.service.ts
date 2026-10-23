import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ICacheManager } from './interfaces/redis-methods.interface';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements ICacheManager,OnModuleInit,OnModuleDestroy {
    private redisClient:Redis;
    private readonly logger=new Logger(RedisService.name)
    constructor(private readonly configService:ConfigService){}

    async onModuleInit() {
        this.logger.log("initialising redis client");
        this.redisClient = new Redis({
            host:this.configService.getOrThrow("REDIS_HOST"),
            port:6379,
            password:this.configService.getOrThrow("REDIS_PASSWORD"),
            lazyConnect:true
        })

        try {
            await this.redisClient.connect();
            this.logger.log("Redis connected succesfully.")
            
        } catch (error) {
            this.logger.error('Failed to connect to Redis', error.stack);
            
        }
    }
 
    async get<T>(key: string): Promise<T | null> {

        const data = await this.redisClient.get(key);

        if(!data){return null};

        try {
            return JSON.parse(data) as T
            
        } catch (error) {
            return data as unknown as T;
            
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {

        const stringValue = typeof value == "object" ? JSON.stringify(value):String(value);

        if(ttlSeconds){
            await this.redisClient.set(key,stringValue,"EX",ttlSeconds);
        }
        else{
            await this.redisClient.set(key,stringValue);


        }
        
    }
    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
        
    }

    async onModuleDestroy() {
        this.logger.log('Closing Redis connection...');
        await this.redisClient.quit();
      }

}

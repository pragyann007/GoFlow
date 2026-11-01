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
        this.logger.log("Initialising Redis client...");
        
        this.redisClient = new Redis({
            host: this.configService.getOrThrow("REDIS_HOST"),
            port: Number(this.configService.getOrThrow("REDIS_PORT") || 6379),
            password: this.configService.getOrThrow("REDIS_PASSWORD"),
            tls: {
                rejectUnauthorized: false,
                servername: this.configService.getOrThrow("REDIS_HOST"), // Crucial for Upstash TLS SNI routing on cloud hosts
            },
            keepAlive: 10000,          // Drop keep-alive down to 10s to prevent Render firewalls from closing idle sockets
            maxRetriesPerRequest: null, // Required for BullMQ / queue operations
            enableReadyCheck: true,
            retryStrategy(times) {
                const delay = Math.min(times * 100, 3000);
                return delay;
            },
        });
    
        // Add error event listeners to prevent unhandled 'error' event crashes on Node.js sockets
        this.redisClient.on('error', (err) => {
            this.logger.error(`Redis Client Error: ${err.message}`);
        });
    
        this.redisClient.on('connect', () => {
            this.logger.log("Redis connection established successfully.");
        });
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

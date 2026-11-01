import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token/access-token.guard';
import { JwtProvider } from './authentication/provider/jwt.provider';
import { WorkflowsModule } from './workflows/workflows.module';
import { NodeModule } from './nodes-engine/node.module';
import { BullModule } from "@nestjs/bullmq"

import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        synchronize: true, // Keep true for initial deploy to auto-create tables, then set to false
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false, // Required for both Neon and Supabase prod layers
        },
      }),
    }),
    
    
    
    
    
    
    
    
    

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow("REDIS_HOST"),
          port: Number(configService.getOrThrow("REDIS_PORT")),
          password: configService.getOrThrow("REDIS_PASSWORD"),
          tls: {
            rejectUnauthorized: false,
            servername: configService.getOrThrow("REDIS_HOST"),
          },
          keepAlive: 10000,          // Keep idle sockets alive against Render's firewall
          maxRetriesPerRequest: null, // REQUIRED for BullMQ to handle reconnects properly
          retryStrategy(times) {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
        },
      }),
    }),AuthenticationModule, UsersModule, RedisModule, WorkflowsModule,NodeModule, SocketGatewayModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:AuthenticationGuard
  },AccessTokenGuard,JwtProvider,JwtService, ],
})
export class AppModule {}

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

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),TypeOrmModule.forRootAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>({
      
      type:"postgres",
      synchronize:true,
      autoLoadEntities:true,
      database:configService.get("DB_NAME"),
      username:configService.get("DB_USERNAME"),
      password:configService.get("DB_PASSWORD"),
      host:configService.get("DB_HOST"),
      port:Number(configService.get("DB_PORT"))

    }),
    
  }),AuthenticationModule, UsersModule, RedisModule, WorkflowsModule,NodeModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:AuthenticationGuard
  },AccessTokenGuard,JwtProvider,JwtService],
})
export class AppModule {}

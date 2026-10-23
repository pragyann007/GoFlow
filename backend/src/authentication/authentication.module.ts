import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { JwtProvider } from './provider/jwt.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token/access-token.guard';

@Module({
  imports:[TypeOrmModule.forFeature([User]),UsersModule,RedisModule,JwtModule.registerAsync( {
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>({
      secret:configService.get("JWT_SECRET"),
    
    })
  }),],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, {
    provide:HashingProvider,
    useClass:BcryptProvider
  }, BcryptProvider, JwtProvider,AccessTokenGuard,AuthenticationGuard],
})
export class AuthenticationModule {}

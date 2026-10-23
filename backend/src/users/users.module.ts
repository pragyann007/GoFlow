import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FindUserProvider } from './provider/find-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, FindUserProvider],
  exports:[UsersService,FindUserProvider]
})
export class UsersModule { }

import { BadRequestException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { HashingProvider } from './provider/hashing.provider';
import { AuthType } from './enums/auth-provider.enum';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { FindUserProvider } from 'src/users/provider/find-user.provider';
import { JwtProvider } from './provider/jwt.provider';
import { REDIS_CLIENT } from 'src/redis/constants/redis.constants';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';
import { ITokenUser } from './interfaces/user-tokengen-interface';
import { find } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
 
    private readonly redis:RedisService,
    private readonly hashProvider: HashingProvider,
    @InjectRepository(User)
    private readonly userRepisotory: Repository<User>,
    private readonly findUserProvider: FindUserProvider,
    private readonly jwtTokenProvider: JwtProvider
  ) { }


  private generateRedisKeyRefreshToken(token:string){
    return `refresh_token:${token}`;


  }
  async register(registerDTO: RegisterDTO) {
    if (!registerDTO.password) {
      throw new BadRequestException("No password sent..")
    };

    console.log("u1")


    const userExists = await this.findUserProvider.findUserExists(registerDTO.email);
    console.log("u2",userExists)

    if (userExists) {
      throw new BadRequestException("User already exists.")
    }
    const hashedPassword = await this.hashProvider.generateHash(registerDTO.password);

    const userData = {
      ...registerDTO,
      password: hashedPassword,
      provider: AuthType.LOCALE

    }

    try {
      let user = this.userRepisotory.create(userData);
      user = await this.userRepisotory.save(user);
      const tokens = await this.jwtTokenProvider.generateTokens(user);
      await this.redis.set(`refresh_token:${tokens.refreshToken}`,{userId:user.id,createdAt:new Date().toISOString()},604800)
      return tokens;


    } catch (error) {
      throw new InternalServerErrorException("Failed to save user")

    }


  }


  async login(loginDTO: LoginDTO) {
    const userExists = await this.findUserProvider.findUserExists(loginDTO.email);

    if (!userExists) {
      throw new BadRequestException("Email doesnt exists...")
    }

    const verifyPassword = await this.hashProvider.verifyHash(loginDTO.password, userExists.password!);

    if (!verifyPassword) {
      throw new BadRequestException("Invalid credentials...")
    }

    const tokens = await this.jwtTokenProvider.generateTokens(userExists);


    await this.redis.set(`refresh_token:${tokens.refreshToken}`,{userId:userExists.id,email:userExists.email,createdAt:new Date().toISOString()},604800)
    

    return tokens;

  }

  async refresh(refreshToken:string){
    const key = this.generateRedisKeyRefreshToken(refreshToken);
    const findTokenInCache:ITokenUser|null = await this.redis.get(key);

    if(!findTokenInCache){
   
      throw new UnauthorizedException("Invalid refersh token")

    }

    const payload = {
      id:findTokenInCache.id,
      email:findTokenInCache.email,

    }
    const tokens = await this.jwtTokenProvider.generateTokens(payload);

    await this.redis.del(key);
    const newKey = this.generateRedisKeyRefreshToken(tokens.refreshToken)
    await this.redis.set(newKey,payload)


    return tokens;


    
  }

  async logout(refreshToken:string){
    const key = this.generateRedisKeyRefreshToken(refreshToken);

try {
      await this.redis.del(key);
      return "OK";
  
} catch (error) {
  throw new InternalServerErrorException("Failed to delete sessionId")
}


  }
}

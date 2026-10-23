import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtProvider } from 'src/authentication/provider/jwt.provider';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtProvider:JwtProvider,private readonly configService:ConfigService){}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {

    const req:Request = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      throw new UnauthorizedException("No token found..")
    }
    
    const verifyToken =await  this.jwtProvider.verifyToken(token,this.configService.getOrThrow("JWT_ACCESS_SECRET"));

    req["user"] = verifyToken;





    return true;
  }
}

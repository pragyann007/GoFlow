import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthType } from '../enums/auth-types.enum';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token/access-token/access-token.guard';
import { AUTHENTICATION_DECORATOR_KEY } from '../constants/auth-key';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly DEFAULT=AuthType.BEARER

  private readonly AuthStrategyMapper:Record<AuthType,CanActivate | CanActivate[]>;

  constructor(private readonly reflector:Reflector,private readonly accessTokenGuard:AccessTokenGuard){
    this.AuthStrategyMapper={
      [AuthType.BEARER]:this.accessTokenGuard,
      [AuthType.NONE]:{canActivate:()=>true}
    }
  }
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {

    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTHENTICATION_DECORATOR_KEY,[context.getHandler(),context.getClass()]) ?? [AuthenticationGuard.DEFAULT]

    const guards = authTypes.map((type)=>this.AuthStrategyMapper[type]).flat();

    let error=new UnauthorizedException("Authentication Failed.");

    for(const instance of guards){
      try {
        const canActivate = await instance.canActivate(context);
        if(canActivate){
          return true
        }
        
      } catch (err) {
        error = err
        
      }
    }


throw error;

  }
}

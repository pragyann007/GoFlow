import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDTO } from './dto/register.dto';
import type {Request, Response } from 'express';
import { LoginDTO } from './dto/login.dto';
import { Authentication } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-types.enum';
import { AccessTokenGuard } from './guards/access-token/access-token/access-token.guard';
import { access } from 'fs';

@Authentication(AuthType.NONE)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post("register")
  async register(@Res({passthrough:true}) response:Response,@Body() registerDTO:RegisterDTO) {
    console.log("hello hnny bunny me hu",registerDTO)
    const tokens =  await this.authenticationService.register(registerDTO);
    response.cookie("refresh-token",tokens.refreshToken);

    return {accessToken:tokens.acessToken}
  }

  @Post("login")
  async login(@Res({passthrough:true

  }) response:Response,@Body() loginDTO:LoginDTO){
    const tokens =  await this.authenticationService.login(loginDTO);
    response.cookie("refresh-token",tokens.refreshToken,{httpOnly:true,sameSite:"strict"});

    return {accessToken:tokens.acessToken}

  }

  @Authentication(AuthType.NONE)
  @Get("get")

  async getall(){
    return "hi"

  }

  @Post("logout")
  async logout(@Req() req:Request,@Res({passthrough:true}) res:Response){
    const refreshToken = req.cookies["refresh-token"];

    res.clearCookie("refresh-token",{
      httpOnly:true,
    });

    await this.authenticationService.logout(refreshToken)

    return {
      message:"Logout succesfull.."
    }
    
  

  }

  @Get("refresh")
  async refresh(@Req() req:Request,@Res({passthrough:true}) res:Response){
    const prevRefreshToken = req.cookies["refresh-token"];
    const {acessToken,refreshToken}=await this.authenticationService.refresh(prevRefreshToken);
    res.cookie("refresh-token",refreshToken);
    return {accessToken:acessToken}


  }
}

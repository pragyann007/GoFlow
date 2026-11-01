import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt"
import { User } from 'src/users/entities/user.entity';
import { ITokenUser } from '../interfaces/user-tokengen-interface';

@Injectable()
export class JwtProvider {
    constructor(
        private readonly configService:ConfigService,
        private readonly jwtService:JwtService
    ){}

    public async signToken<T>(userId:string,exp:string,secret:string,payload?:T){

        const token = this.jwtService.sign({
            sub:userId,
            ...payload
        },{
            secret,
            expiresIn:Number(exp)
        })

        return token;

    }

    public async generateTokens(user: User | ITokenUser) {
        const payload = { email: user.email };

        const [acessToken, refreshToken] = await Promise.all([
            // Access Token
            this.signToken(
                user.id, 
                this.configService.getOrThrow("JWT_ACCESS_TOKEN_TTL"), 
                this.configService.getOrThrow("JWT_ACCESS_SECRET"), 
                payload
            ),
            // Refresh Token - NOW INCLUDES PAYLOAD TOO (or at least sub is explicitly handled by signToken)
            this.signToken(
                user.id, 
                this.configService.getOrThrow("JWT_REFRESH_TOKEN_TTL"), // Also make sure TTL uses refresh secret config if separate!
                this.configService.getOrThrow("JWT_REFRESH_SECRET"), 
                payload
            ),
        ]);

        return { acessToken, refreshToken };
    }

    public async verifyToken(token:string,secret:string){
        try {
            return await this.jwtService.verifyAsync(token,
                {
                    secret
    
                });
        } catch (error) {
            throw new UnauthorizedException("Invalid token..")
            
        }
    }
}

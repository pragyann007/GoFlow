import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { InternalServerErrorException } from "@nestjs/common";
import { Authentication } from "src/authentication/entities/authentication.entity";
import { User } from "../entities/user.entity";

export class FindUserProvider{
    constructor(
        @InjectRepository(User)
        private readonly authRepiository:Repository<User>
    ){}

    async findUserExists(email:string){
       try {
         let user =await this.authRepiository.findOneBy({email});
 
        return user;
       } catch (error) {
        throw new InternalServerErrorException("Db failed..")
        
       }

    }
}
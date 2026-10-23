import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract generateHash(text:string):Promise<string>;
    abstract verifyHash(plainText:string,hashText:string):Promise<Boolean>;
}

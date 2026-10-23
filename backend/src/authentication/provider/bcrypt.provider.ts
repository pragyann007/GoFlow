import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from "bcryptjs"

@Injectable()
export class BcryptProvider extends HashingProvider {
    async generateHash(text: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedText = await bcrypt.hash(text,salt);
        return hashedText;
    }

    async verifyHash(plainText: string, hashText: string): Promise<Boolean> {

        const isMatch = await bcrypt.compare(plainText,hashText);
        return isMatch;
        
    }
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  async compareStringWithHash(incomingString: string, hash: string) {
    try {
      const result = await bcrypt.compare(incomingString, hash);

      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async generateHashFromString(value: string, salt = 4) {
    const hashPassword = await bcrypt.hash(value, salt);
    return hashPassword;
  }
}

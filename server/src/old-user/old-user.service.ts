import { Injectable } from '@nestjs/common';
import { OldUserRepository } from './old-user.repository';
import { OldUser } from './old-user.model';

@Injectable()
export class OldUserService {
  constructor(private readonly oldUserRepository: OldUserRepository) {}

  async signUp(phoneNumber: string, nickname: string): Promise<OldUser | null> {
    return await this.oldUserRepository.createUser(phoneNumber, nickname);
  }
}

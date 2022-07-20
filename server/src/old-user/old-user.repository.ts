import { Injectable } from '@nestjs/common';
import { OldUser } from './old-user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OldUserRepository {
  constructor(
    @InjectModel(OldUser.name) private readonly oldUser: Model<OldUser>,
  ) {}

  async createUser(
    phoneNumber: string,
    nickname: string,
  ): Promise<OldUser | null> {
    const result = await this.oldUser.create({ phoneNumber, nickname });
    console.log('result >> ', result);

    return result;
  }
}

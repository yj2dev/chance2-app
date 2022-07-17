import { Injectable } from '@nestjs/common';
import { OldUser } from './old-user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OldUserRepository {
  constructor(
    @InjectModel(OldUser.name) private readonly user: Model<OldUser>,
  ) {}
}

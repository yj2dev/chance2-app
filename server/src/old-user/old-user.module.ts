import { Module } from '@nestjs/common';
import { OldUser, OldUserSchema } from './old-user.model';
import { OldUserController } from './old-user.controller';
import { OldUserService } from './old-user.service';
import { OldUserRepository } from './old-user.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OldUser.name, schema: OldUserSchema }]),
  ],
  controllers: [OldUserController],
  providers: [OldUserService, OldUserRepository],
  exports: [OldUserService, OldUserRepository],
})
export class OldUserModule {}

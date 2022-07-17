import { Module } from '@nestjs/common';
import { OldUserModule } from '../old-user/old-user.module';
import { DefaultUserModule } from '../default-user/default-user.module';
import { InstitutionUserModule } from '../institution-user/institution-user.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [OldUserModule, DefaultUserModule, InstitutionUserModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

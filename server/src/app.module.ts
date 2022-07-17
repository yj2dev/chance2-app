import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OldUserController } from './old-user/old-user.controller';
import { DefaultUserController } from './default-user/default-user.controller';
import { InstitutionUserController } from './institution-user/institution-user.controller';
import { InstitutionUserService } from './institution-user/institution-user.service';
import { OldUserService } from './old-user/old-user.service';
import { DefaultUserService } from './default-user/default-user.service';
import { OldUserModule } from './old-user/old-user.module';
import { DefaultUserModule } from './default-user/default-user.module';
import { InstitutionUserModule } from './institution-user/institution-user.module';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OldUserModule,
    DefaultUserModule,
    InstitutionUserModule,
    MessageModule,
    RedisCacheModule,
  ],
  controllers: [
    AppController,
    OldUserController,
    DefaultUserController,
    InstitutionUserController,
    MessageController,
  ],
  providers: [
    AppService,
    InstitutionUserService,
    OldUserService,
    DefaultUserService,
    MessageService,
  ],
})
export class AppModule {}

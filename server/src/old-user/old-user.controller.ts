import { Body, Controller, Post } from '@nestjs/common';
import { OldUserService } from './old-user.service';

@Controller('old-user')
export class OldUserController {
  constructor(private readonly oldUserService: OldUserService) {}

  @Post('signup')
  async signUp(@Body('phoneNumber') phoneNumber, @Body('nickname') nickname) {
    return await this.oldUserService.signUp(phoneNumber, nickname);
  }
}

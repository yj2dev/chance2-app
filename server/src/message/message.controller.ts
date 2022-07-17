import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from '../common/interceptor/success.interceptor';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { MessageService } from './message.service';

@Controller('message')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('/verify-number/send')
  async sendAuthenticationCode(
    @Body('phoneNumber') phoneNumber: string,
    @Body('identificationCode') identificationCode: string,
  ) {
    return await this.messageService.sendVerifyNumber(
      phoneNumber,
      identificationCode,
    );
  }

  @Post('/verify-number/check')
  async codeCheck(
    @Body('phoneNumber') phoneNumber: string,
    @Body('verifyNumber') verifyNumber: string,
  ) {
    return await this.messageService.checkVerifyNumber(
      phoneNumber,
      verifyNumber,
    );
  }
}

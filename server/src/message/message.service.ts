import { HttpException, UnauthorizedException } from '@nestjs/common';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';

export class MessageService {
  constructor(
    private readonly messageService: MessageService,
    private readonly redisCacheService: RedisCacheService,
  ) {}
  private readonly NAVER_ACCESS_KEY = process.env.NAVER_ACCESS_KEY;
  private readonly NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY;
  private readonly NAVER_SERVICE_ID = process.env.NAVER_SERVICE_ID;
  private readonly NAVER_SMS_SEND_NUMBER = process.env.NAVER_SMS_SEND_NUMBER;

  async checkVerifyNumber(
    phoneNumber: string,
    verityNumber: string,
  ): Promise<boolean> {
    const cacheValue = await this.redisCacheService.getKey(
      phoneNumber.toString(),
    );

    console.log('cacheValue >> ', cacheValue);
    // TODO: del

    const isPhoneNumber = false;

    // const isPhoneNumber = await this.userRepository.existsByPhoneNumber(
    //   phoneNumber,
    // );

    // 가입이 되어 있다면 결과 반환
    if (isPhoneNumber) {
      throw new UnauthorizedException(
        '동일한 번호로 가입된 유저가 존재합니다.',
      );
    }

    // 인증번호 값이 유저가 입력한 인증번호와 일치할때
    if (cacheValue && cacheValue === verityNumber) {
      return true;
    } else {
      // 캐시메모리에 휴대번호가 없거나 휴대번호의 코드가 일치하지 않을 때
      return false;
    }
  }

  async sendVerifyNumber(phoneNumber: string, identificationCode: string) {
    const host = 'https://sens.apigw.ntruss.com';
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = `/sms/v2/services/${this.NAVER_SERVICE_ID}/messages`;
    const timestamp = Date.now().toString();
    const accessKey = this.NAVER_ACCESS_KEY;
    const secretKey = this.NAVER_SECRET_KEY;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    const random4Number = [0, 0, 0, 0];
    random4Number.forEach((v, i) => {
      random4Number[i] = Math.floor(Math.random() * 10);
    });
    const stringRandom4Number = random4Number.join('');

    const payload = {
      type: 'SMS',
      countryCode: '82',
      contentType: 'COMM',
      from: this.NAVER_SMS_SEND_NUMBER,
      content: `<#> 우연이 인증번호는 [${stringRandom4Number}]입니다. ${identificationCode}`,
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };

    const resultSendMessage = async () => {
      try {
        const res = await axios.post(`${host}${url}`, payload, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-iam-access-key': this.NAVER_ACCESS_KEY,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-apigw-signature-v2': signature,
          },
        });

        return res;
      } catch (err) {
        // console.log('resultSendMessage err >> ', err);
        throw new HttpException('인증문자 발송에 실패했습니다.', 500);
      }
    };

    const result = await resultSendMessage();

    try {
      // 레디스 캐시메모리에 2분간 저장
      await this.redisCacheService.setKey(
        phoneNumber.toString(),
        stringRandom4Number,
        120,
      );
    } catch (err) {
      throw new HttpException('인증번호를 저장하지 못했습니다.', 500);
    }

    if (result.data.statusName === 'success') return true;
  }
}

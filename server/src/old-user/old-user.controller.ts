import { Controller } from '@nestjs/common';
import { OldUserService } from './old-user.service';

@Controller('old-user')
export class OldUserController {
  constructor(private readonly odUserService: OldUserService) {}
}

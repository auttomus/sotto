import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IamService } from './iam.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator'; // <-- IMPORT DEKORATOR INI

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Public() // Buka gerbang untuk pendaftaran
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.iamService.register(dto);
  }

  @Public() // Buka gerbang untuk login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.iamService.login(dto);
  }
}

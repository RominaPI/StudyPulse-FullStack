import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Post('register')
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Public() @HttpCode(200) @Post('login')
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Public() @HttpCode(200) @Post('forgot-password')
  forgot(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto); }

  @Public() @HttpCode(200) @Post('reset-password')
  reset(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto); }

  @ApiBearerAuth() @Get('me')
  me(@CurrentUser() user: any) { return user; }
}

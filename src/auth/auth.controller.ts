import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { GetCurrentUser, Public } from 'src/shared/decorators';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshTokenGuard } from 'src/shared/guards';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpAuthDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  @Public()
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('id') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokenGeneration(userId, refreshToken);
  }
}

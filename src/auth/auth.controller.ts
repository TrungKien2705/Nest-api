import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { Request } from 'express';
import MyJwtGuardRefresh from './guard/refreshjwt.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDTO) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: AuthDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body, response);
  }
  @UseGuards(MyJwtGuardRefresh)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refresh_token;
    const data = request.user;
    return this.authService.refreshService(refreshToken, data, response);
  }
}

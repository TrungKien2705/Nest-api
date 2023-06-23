import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';

declare module 'express' {
  export interface Request {
    user: any;
  }
}
@Controller('user')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('/me')
  me(@Req() request: Request) {
    return request.user;
  }
}

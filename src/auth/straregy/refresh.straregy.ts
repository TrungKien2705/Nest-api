import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { dataToken } from '../dto/auth.dto';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: config.get('REFRESH_TOKEN'),
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: { data: any }) {
    console.log(request);
    console.log(payload);
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.data.id,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    delete user.hashedPassword;
    return user;
  }
}

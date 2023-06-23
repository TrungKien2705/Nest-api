import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { dataToken } from '../dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { data: dataToken }) {
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

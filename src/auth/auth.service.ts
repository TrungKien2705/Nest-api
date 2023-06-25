import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, dataToken } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(data: AuthDTO) {
    try {
      const hashedPassword = await argon.hash(data.password);

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      delete user.hashedPassword;
      return {
        msg: 'Register User success!',
        data: user,
      };
    } catch (error) {
      throw new ForbiddenException(
        'Register User fail by Email already exists !',
      );
    }
  }

  async login(data: AuthDTO, response: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const passwordMatched = await argon.verify(
      user.hashedPassword,
      data.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Wrong password !');
    }

    delete user.hashedPassword;
    const access_token = await this.accessToken(user);
    const refresh_token = await this.refreshToken(user);

    response.cookie('refresh_token', refresh_token, { httpOnly: true });
    return {
      msg: 'Login success!',
      access_token,
    };
  }
  async accessToken(data: dataToken): Promise<string> {
    const payload = {
      data,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '30s',
      secret: this.config.get('ACCESS_TOKEN'),
    });
  }
  async refreshToken(data: dataToken): Promise<string> {
    const payload = {
      data,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: this.config.get('REFRESH_TOKEN'),
    });
  }
  async refreshService(refreshToken: string, data: dataToken, response: any) {
    if (!refreshToken) {
      throw new ForbiddenException('You not authenticated');
    }
    const access_token = await this.accessToken(data);
    const refresh_token = await this.refreshToken(data);
    response.cookie('refresh_token', refresh_token, { httpOnly: true });
    return {
      access_token,
    };
  }
}

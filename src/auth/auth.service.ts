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

  async login(data: AuthDTO) {
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
    return {
      msg: 'Login success!',
      token: await this.convertToJwt(user),
    };
  }
  async convertToJwt(data: dataToken): Promise<string> {
    const payload = {
      data,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}

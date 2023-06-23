import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MinLength(5)
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface dataToken {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

import mongoose from 'mongoose';
import { User } from '../schemas/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserResponseDto {
  constructor(user: User) {
    const { _id, name, email } = user;

    return { _id, name, email };
  }

  @ApiProperty({ required: true })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: false })
  private?: boolean;
}

import { User } from '../schemas/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileUserResponseDto {
  constructor(user: User) {
    const { _id, username, email, privy, profile_picture, bio } = user;

    return { _id: String(_id), username, email, privy, profile_picture, bio };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: false })
  bio: string;

  @ApiProperty({ required: true })
  privy: boolean;

  @ApiProperty({ required: true })
  @IsString()
  profile_picture: string | null;
}

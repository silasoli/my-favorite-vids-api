import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IloginPayload } from '../interfaces/Ipayload.interface';

export class UserLoginResponseDto {
  constructor(user: IloginPayload) {
    const { id, username, email, access_token } = user;

    return { id: String(id), username, email, access_token };
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true })
  access_token: string;
}

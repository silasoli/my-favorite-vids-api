import { User } from '../schemas/user.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Roles from '../../roles/enums/role.enum';

export class UserResponseDto {
  constructor(user: User) {
    const { _id, username, email, privy, roles } = user;

    return { _id: String(_id), username, email, privy, roles };
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

  @ApiProperty({ required: true })
  roles: Roles[];

  @ApiProperty({ required: true })
  privy: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UsernameQueryDTO {
  @ApiProperty({ required: true, description: 'Envie um username válido' })
  @IsString({ message: 'O username deve ser uma string.' })
  @IsNotEmpty({ message: 'O username não pode estar vazio.' })
  username: string;
}

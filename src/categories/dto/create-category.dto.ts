import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o ID do usuário.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  user_id: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'O Nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o nome da categoria.' })
  name: string;

  @ApiProperty({ required: true })
  @IsBoolean({ message: 'A privacidade da categoria deve ser um boleano.' })
  @IsNotEmpty({ message: 'É necessário informar a privacidade da categoria.' })
  privy: boolean;
}

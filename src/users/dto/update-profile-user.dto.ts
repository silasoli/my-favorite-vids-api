import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateProfileUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/category.entity';

export class CategoryResponseDto {
  constructor(category: Category) {
    const { _id, name, privy } = category;

    return { _id: String(_id), name, privy };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'É necessário informar o nome da categoria.' })
  name: string;

  @ApiProperty({ required: true })
  privy: boolean;
}

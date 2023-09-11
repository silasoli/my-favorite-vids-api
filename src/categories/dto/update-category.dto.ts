import { PartialType } from '@nestjs/swagger';
import {
  CreateCategoryDto,
  CreateCategoryToUserDto,
} from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryOfUserDto extends PartialType(
  CreateCategoryToUserDto,
) {}

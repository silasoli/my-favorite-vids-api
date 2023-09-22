import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryToUserDto } from '../dto/create-category.dto';
import { UpdateCategoryOfUserDto } from '../dto/update-category.dto';
import { Category, CategoryDocument } from '../schemas/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class UserCategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private categoriesService: CategoriesService,
  ) {}

  public async createToUser(
    user_id: string,
    dto: CreateCategoryToUserDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create({ ...dto, user_id });
  }

  public async findAllCategoriesOfUser(
    user_id: string,
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryModel.find({ user_id });

    return categories.map((category) => new CategoryResponseDto(category));
  }

  private async findCategoryByIDOfUser(
    _id: string,
    user_id: string,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id, user_id });

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  public async findOneCategoryOfUser(
    _id: string,
    user_id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.findCategoryByIDOfUser(_id, user_id);

    return new CategoryResponseDto(category);
  }

  public async updateCategoryOfUser(
    _id: string,
    user_id: string,
    dto: UpdateCategoryOfUserDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.findCategoryByIDOfUser(_id, user_id);

    if (dto.privy && !category.privy)
      throw new ForbiddenException(
        'Você não pode modificar a privacidade de uma Categoria Pública',
      );

    await this.categoryModel.updateOne({ _id, user_id }, dto);

    return new CategoryResponseDto(
      await this.findCategoryByIDOfUser(_id, user_id),
    );
  }

  public async removeCategoryOfUser(
    _id: string,
    user_id: string,
  ): Promise<void> {
    const category = await this.findCategoryByIDOfUser(_id, user_id);

    if (!category.privy)
      throw new ForbiddenException(
        'Você não pode excluir uma Categoria Pública',
      );

    await this.categoryModel.deleteOne({ _id, user_id });
  }
}

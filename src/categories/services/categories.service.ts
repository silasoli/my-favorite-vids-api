import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category, CategoryDocument } from '../schemas/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  public async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const created = await this.categoryModel.create(dto);

    return new CategoryResponseDto(created);
  }

  public async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryModel.find();

    return categories.map((category) => new CategoryResponseDto(category));
  }

  private async findCategoryByID(_id: string): Promise<Category> {
    const category = await this.categoryModel.findById(_id);

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  public async findOne(_id: string): Promise<CategoryResponseDto> {
    const category = await this.findCategoryByID(_id);

    return new CategoryResponseDto(category);
  }

  public async update(
    _id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    await this.findCategoryByID(_id);

    await this.categoryModel.updateOne({ _id }, dto);

    return new CategoryResponseDto(await this.findCategoryByID(_id));
  }

  public async remove(_id: string): Promise<void> {
    await this.findCategoryByID(_id);

    await this.categoryModel.deleteOne({ _id });
  }
}

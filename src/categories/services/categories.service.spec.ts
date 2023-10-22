import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category, CategoryDocument } from '../schemas/category.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

const _id: string = '64eba27123601b83fc5104cb';
const updatedId: string = '12eba14123601b83fc7105cc';

const category: CreateCategoryDto = {
  user_id: faker.database.mongodbObjectId(),
  name: faker.commerce.department(),
  privy: faker.datatype.boolean(),
};

const updateDto: UpdateCategoryDto = {
  name: 'updatedName',
  privy: true,
};

const categoryDB = {
  _id: faker.database.mongodbObjectId(),
  user_id: faker.database.mongodbObjectId(),
  name: faker.commerce.department(),
  privy: faker.datatype.boolean(),
  createdAt: new Date(),
};

const categoryUpdated = {
  _id: faker.database.mongodbObjectId(),
  user_id: faker.database.mongodbObjectId(),
  name: updateDto.name,
  privy: updateDto.privy,
  createdAt: new Date(),
};

const categoriesList = [categoryDB];

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryModel: Model<CategoryDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            create: jest.fn().mockResolvedValue({
              _id: faker.database.mongodbObjectId(),
              ...category,
              createdAt: new Date(),
            }),
            findOne: jest.fn().mockImplementation((_idSearch) => {
              if (_idSearch._id === _id) return { ...categoryDB, _id };

              if (_idSearch._id === updatedId)
                return { ...categoryUpdated, _id };

              return null;
            }),
            findById: jest.fn().mockImplementation((_idSearch: string) => {
              if (_idSearch === _id) return { ...categoryDB, _id };

              if (_idSearch === updatedId) return { ...categoryUpdated, _id };

              return null;
            }),
            find: jest.fn().mockResolvedValue(categoriesList),
            updateOne: jest
              .fn()
              .mockImplementation((_id, dto: UpdateCategoryDto) => {
                return { ...categoryUpdated, ...dto };
              }),

            deleteOne: jest
              .fn()
              .mockResolvedValue({ n: 1, ok: 1, deletedCount: 1 }),
          },
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoryModel = module.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
    expect(categoryModel).toBeDefined();
  });

  describe('CategoriesService', () => {
    describe('create', () => {
      it('should create a category', async () => {
        const createdCategory = await categoriesService.create(category);

        expect(categoryModel.create).toHaveBeenCalledWith(category);
        expect(createdCategory.name).toBe(category.name);
        expect(createdCategory.privy).toBe(category.privy);
      });
    });

    describe('findAll', () => {
      it('should findAll categories', async () => {
        const findAllCategories = await categoriesService.findAll();

        expect(findAllCategories[0]._id).toBe(categoriesList[0]._id);
        expect(findAllCategories[0].name).toBe(categoriesList[0].name);
        expect(findAllCategories[0].privy).toBe(categoriesList[0].privy);
      });
    });

    describe('findOne', () => {
      it('should findOne a category', async () => {
        const findOneCategory = await categoriesService.findOne(_id);

        expect(findOneCategory._id).toBe(_id);
        expect(findOneCategory.name).toBe(categoryDB.name);
        expect(findOneCategory.privy).toBe(categoryDB.privy);
      });

      it('should not findOne a category', async () => {
        await expect(categoriesService.findOne('123456')).rejects.toThrowError(
          'Categoria não encontrada',
        );
      });
    });

    describe('update', () => {
      it('should update a category', async () => {
        const updatedCategory = await categoriesService.update(
          updatedId,
          updateDto,
        );

        expect(updatedCategory.name).toBe(updateDto.name);
        expect(updatedCategory.privy).toBe(updateDto.privy);
      });

      it('should not update a category', async () => {
        await expect(
          categoriesService.update('123456', updateDto),
        ).rejects.toThrowError('Categoria não encontrada');
      });
    });

    it('should not update a category', async () => {
      await expect(
        categoriesService.update('123456', updateDto),
      ).rejects.toThrowError('Categoria não encontrada');
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      await categoriesService.remove(_id);
      expect(categoryModel.deleteOne).toHaveBeenCalled();
    });

    it('should not remove a category', async () => {
      await expect(categoriesService.remove('123456')).rejects.toThrowError(
        'Categoria não encontrada',
      );
    });
  });
});

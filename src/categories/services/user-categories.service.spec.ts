import { Test, TestingModule } from '@nestjs/testing';
import { UserCategoriesService } from './user-categories.service';
import { CategoriesService } from './categories.service';
import { Category, CategoryDocument } from '../schemas/category.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryToUserDto } from '../dto/create-category.dto';
import { UpdateCategoryOfUserDto } from '../dto/update-category.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

const _id: string = '64eba27123601b83fc5104cb';
const updatedId: string = '12eba14123601b83fc7105cc';
const userId: string = '53abc14123601b83fc3107ad';

const createCategoryToUserDto: CreateCategoryToUserDto = {
  name: faker.commerce.department(),
  privy: faker.datatype.boolean(),
};

const updateCategoryOfUserDto: UpdateCategoryOfUserDto = {
  name: 'updatedCategoryName',
  privy: true,
};

const categoryDB = {
  _id: faker.database.mongodbObjectId(),
  user_id: userId,
  name: faker.commerce.department(),
  privy: faker.datatype.boolean(),
  createdAt: new Date(),
};

const categoriesList = [categoryDB];

describe('UserCategoriesService', () => {
  let userCategoriesService: UserCategoriesService;
  let categoryModel: Model<CategoryDocument>;
  let categoriesService: CategoriesService;


  const mockCategoryModel = {
    create: jest.fn().mockResolvedValue({
      _id: faker.database.mongodbObjectId(),
      ...createCategoryToUserDto,
      user_id: userId,
      createdAt: new Date(),
    }),
    findOne: jest.fn().mockImplementation((query) => {
      if (query._id === _id && query.user_id === userId) return { ...categoryDB, _id };
      if (query._id === updatedId && query.user_id === userId) return { ...categoryDB, ...updateCategoryOfUserDto, _id };
      return null;
    }),
    find: jest.fn().mockResolvedValue(categoriesList),
    updateOne: jest.fn().mockImplementation((query, dto: UpdateCategoryOfUserDto) => {
      return { ...categoryDB, ...dto };
    }),
    deleteOne: jest.fn().mockResolvedValue({ n: 1, ok: 1, deletedCount: 1 }),
  };

  const mockCategoriesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCategoriesService,
        {
          provide: CategoriesService,
          useValue: mockCategoriesService
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    userCategoriesService = module.get<UserCategoriesService>(UserCategoriesService);
    categoryModel = module.get<Model<CategoryDocument>>(getModelToken(Category.name));
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(userCategoriesService).toBeDefined();
    expect(categoryModel).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  describe('createToUser', () => {
    it('should create a category for a user', async () => {
      const createdCategory = await userCategoriesService.createToUser(userId, createCategoryToUserDto);
      expect(createdCategory).toHaveProperty('name', createCategoryToUserDto.name);
      expect(createdCategory.privy).toBe(createCategoryToUserDto.privy);
      expect(categoriesService.create).toHaveBeenCalledWith({ ...createCategoryToUserDto, user_id: userId });
    });    
  });

  describe('findAllCategoriesOfUser', () => {
    it('should find all categories of a user', async () => {
      const userCategories = await userCategoriesService.findAllCategoriesOfUser(userId);
      expect(userCategories[0].name).toBe(categoriesList[0].name);
      expect(categoryModel.find).toHaveBeenCalledWith({ user_id: userId });
    });
  });

  describe('findOneCategoryOfUser', () => {
    it('should find a specific category of a user', async () => {
      const category = await userCategoriesService.findOneCategoryOfUser(_id, userId);
      expect(category.name).toBe(categoryDB.name);
      expect(categoryModel.findOne).toHaveBeenCalledWith({ _id, user_id: userId });
    });

    it('should throw NotFoundException if category is not found', async () => {
      await expect(userCategoriesService.findOneCategoryOfUser('nonexistentId', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCategoryOfUser', () => {
    it('should update a specific category of a user', async () => {
      const updatedCategory = await userCategoriesService.updateCategoryOfUser(updatedId, userId, updateCategoryOfUserDto);
      expect(updatedCategory.name).toBe(updateCategoryOfUserDto.name);
      expect(categoryModel.updateOne).toHaveBeenCalledWith({ _id: updatedId }, updateCategoryOfUserDto);
    });

    it('should not allow modifying the privacy of a public category', async () => {
      const publicCategoryDto = { ...updateCategoryOfUserDto, privy: false };
      const publicCategory = { ...categoryDB, privy: false };
      mockCategoryModel.findOne.mockResolvedValueOnce(publicCategory); // Mock a public category
    
      await expect(userCategoriesService.updateCategoryOfUser(updatedId, userId, publicCategoryDto)).rejects.toThrow(ForbiddenException);
    });
    

    it('should throw NotFoundException if category is not found', async () => {
      await expect(userCategoriesService.updateCategoryOfUser('nonexistentId', userId, updateCategoryOfUserDto)).rejects.toThrow(NotFoundException);
    });
    
  });

  describe('removeCategoryOfUser', () => {
    it('should remove a category of a user', async () => {
      await userCategoriesService.removeCategoryOfUser(_id, userId);
      expect(categoryModel.deleteOne).toHaveBeenCalledWith({ _id, user_id: userId });
    });

    it('should not allow removing a public category', async () => {
      const publicCategory = { ...categoryDB, privy: false };
      await expect(userCategoriesService.removeCategoryOfUser(publicCategory._id, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if category is not found', async () => {
      await expect(userCategoriesService.removeCategoryOfUser('nonexistentId', userId)).rejects.toThrow(NotFoundException);
    });
  });
});


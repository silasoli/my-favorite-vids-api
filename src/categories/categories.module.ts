import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.entity';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { UserCategoriesController } from './controllers/user-categories.controller';
import { UserCategoriesService } from './services/user-categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController, UserCategoriesController],
  providers: [CategoriesService, UserCategoriesService],
})
export class CategoriesModule {}

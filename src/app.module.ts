import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { VideosModule } from './videos/videos.module';
import { CommonModule } from './common/common.module';
import { DiscoverModule } from './discover/discover.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CommonModule,
    UsersModule,
    AuthModule,
    RolesModule,
    CategoriesModule,
    VideosModule,
    DiscoverModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

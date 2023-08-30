import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.entity';
import { UsersProfileController } from './controllers/users-profile.controller';
import { UsersProfileService } from './services/users-profile.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UsersProfileController],
  providers: [UsersService, UsersProfileService],
  exports: [UsersService],
})
export class UsersModule {}

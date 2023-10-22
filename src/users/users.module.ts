import { Global, Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin-users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AdminUsersController, UserController],
  providers: [UsersService, UserService],
  exports: [UsersService],
})
export class UsersModule {}

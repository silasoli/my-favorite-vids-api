import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from '../videos/entities/video.entity';
import { User, UserSchema } from '../users/schemas/user.entity';
import { UserDiscoverController } from './controllers/user-discover.controller';
import { UserDiscoverService } from './services/user-discover.service';
import { DiscoverController } from './controllers/discover.controller';
import { DiscoverService } from './services/discover.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserDiscoverController, DiscoverController],
  providers: [UserDiscoverService, DiscoverService],
})
export class DiscoverModule {}

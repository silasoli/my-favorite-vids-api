import { Module } from '@nestjs/common';
import { AdminVideosService } from './services/admin-videos.service';
import { AdminVideosController } from './controllers/admin-videos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './entities/video.entity';
import { UserVideosController } from './controllers/user-videos.controller';
import { UserVideosService } from './services/user-videos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [AdminVideosController, UserVideosController],
  providers: [AdminVideosService, UserVideosService],
})
export class VideosModule {}

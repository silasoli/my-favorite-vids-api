import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import { VideoResponseDto } from '../../videos/dto/response-video.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { Video, VideoDocument } from '../../videos/entities/video.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';

@Injectable()
export class DiscoverService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly paginationService: PaginationService,
  ) {}

  private async findVideoByID(_id: string): Promise<Video> {
    const video = await this.videoModel.findOne({ privy: false, _id });

    if (!video) throw new NotFoundException('Vídeo não encontrado.');

    return video;
  }

  public async findOne(_id: string): Promise<VideoResponseDto> {
    const video = await this.findVideoByID(_id);
    return new VideoResponseDto(video);
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ privy: false, username });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async discoverPublicUsersByUsername(
    username: string,
  ): Promise<UserResponseDto> {
    const user = await this.findUserByUsername(username);
    return new UserResponseDto(user);
  }

  public async discoverPublicVideosByUserId(
    user_id: string,
    query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    const filters: any = { user_id };

    if (query.platform) filters.platform = query.platform;

    if (query.title) {
      filters.title = {
        $regex: `.*${query.title.toLowerCase()}.*`,
        $options: 'i',
      };
    }

    const paginatedData = await this.paginationService.pagination(
      this.videoModel,
      query.page,
      filters,
    );

    const data = paginatedData.data.map((video) => new VideoResponseDto(video));

    return new PaginatedResponseVideosDto(data, paginatedData.meta);
  }
}

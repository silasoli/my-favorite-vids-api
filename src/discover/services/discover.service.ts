import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import { VideoResponseDto } from '../../videos/dto/response-video.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { Video, VideoDocument } from '../../videos/entities/video.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.entity';
import { VideoUserResponseDto } from '../dto/response-video-user.dto';
import mongoose from 'mongoose';
import { ExternalUserResponseDto } from '../dto/response-external-user.dto';

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
    const video = await this.videoModel
      .findOne({ privy: false, _id })
      .populate({ path: 'user_id' });

    if (!video) throw new NotFoundException('Vídeo não encontrado.');

    return video;
  }

  public async findOne(_id: string): Promise<VideoUserResponseDto> {
    const video = await this.findVideoByID(_id);
    return new VideoUserResponseDto(video);
  }

  public async discoverPublicVideosByUserId(
    user_id: string,
    query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    const filters: any = { user_id, privy: false };

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

  public async getPlatformsFromUserVideos(user_id: string): Promise<string[]> {
    const aggregationPipeline = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
          privy: false,
        },
      },
      {
        $group: {
          _id: null,
          platforms: { $addToSet: '$platform' },
        },
      },
      {
        $project: {
          _id: 0,
          platforms: 1,
        },
      },
    ];

    const result = await this.videoModel.aggregate(aggregationPipeline);

    return result.length > 0 ? result[0].platforms.sort() : [];
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ privy: false, username });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async discoverPublicUsersByUsername(
    username: string,
  ): Promise<ExternalUserResponseDto> {
    const user = await this.findUserByUsername(username);
    return new ExternalUserResponseDto(user);
  }

  private async findUserByID(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ privy: false, _id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async discoverPublicUsersID(
    _id: string,
  ): Promise<ExternalUserResponseDto> {
    const user = await this.findUserByID(_id);
    return new ExternalUserResponseDto(user);
  }
}

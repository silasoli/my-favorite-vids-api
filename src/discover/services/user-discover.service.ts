import { Injectable } from '@nestjs/common';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import { VideoResponseDto } from '../../videos/dto/response-video.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { Video, VideoDocument } from '../../videos/entities/video.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../users/schemas/user.entity';
import { UsersQueryDto } from '../../users/dto/users-query.dto';
import { PaginatedResponseUsersDto } from '../../users/dto/paginated-response-users.dto';
import { ProfileUserResponseDto } from '../../users/dto/profile-user-response.dto';

@Injectable()
export class UserDiscoverService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly paginationService: PaginationService,
  ) {}

  public async discoverPublicVideos(
    query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    const filters: any = { privy: false };

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

  public async discoverPublicUsers(
    query: UsersQueryDto,
  ): Promise<PaginatedResponseUsersDto> {
    const filters: any = { privy: false };

    if (query.username) {
      filters.username = {
        $regex: `.*${query.username.toLowerCase()}.*`,
        $options: 'i',
      };
    }

    const paginatedData = await this.paginationService.pagination(
      this.userModel,
      query.page,
      filters,
    );

    const data = paginatedData.data.map(
      (user) => new ProfileUserResponseDto(user),
    );

    return new PaginatedResponseUsersDto(data, paginatedData.meta);
  }
}

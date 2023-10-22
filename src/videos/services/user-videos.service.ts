import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateVideoDto } from '../dto/create-video.dto';
import { UserUpdateVideoDto } from '../dto/update-video.dto';
import { Video, VideoDocument } from '../entities/video.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoResponseDto } from '../dto/response-video.dto';
import mongoose from 'mongoose';
import { EngineValidationVideosService } from './engine-validation-videos.service';
import { PaginationService } from '../../common/services/pagination.service';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../dto/paginated-response-video.dto';

@Injectable()
export class UserVideosService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
    private readonly engineValidationVideosService: EngineValidationVideosService,
    private readonly paginationService: PaginationService,
  ) {}

  public async getPlatformsFromUserVideos(user_id: string): Promise<string[]> {
    const aggregationPipeline = [
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
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

  async validateCreate(user_id: string, title: string): Promise<void> {
    const existingVideo = await this.videoModel.findOne({ user_id, title });

    if (existingVideo)
      throw new ConflictException(
        'Você já cadastrou um vídeo com esse titulo.',
      );
  }

  public async createToUser(
    user_id: string,
    dto: UserCreateVideoDto,
  ): Promise<VideoResponseDto> {
    const url = this.engineValidationVideosService.validateURL(dto);

    await this.validateCreate(user_id, dto.title);

    const created = await this.videoModel.create({ ...dto, url, user_id });

    return new VideoResponseDto(created);
  }

  public async findAllVideosOfUser(
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

  private async findVideoByIDOfUser(
    _id: string,
    user_id: string,
  ): Promise<Video> {
    const video = await this.videoModel.findOne({ _id, user_id });

    if (!video) throw new NotFoundException('Vídeo não encontrado.');

    return video;
  }

  public async findOneVideoOfUser(
    _id: string,
    user_id: string,
  ): Promise<VideoResponseDto> {
    const category = await this.findVideoByIDOfUser(_id, user_id);

    return new VideoResponseDto(category);
  }

  async validateUpdate(
    _id: string,
    user_id: string,
    title: string,
  ): Promise<void> {
    const existingVideo = await this.videoModel.findOne({
      _id: { $ne: _id },
      user_id,
      title,
    });

    if (existingVideo) {
      throw new ConflictException(
        'Você já cadastrou um vídeo com esse titulo.',
      );
    }
  }

  public async updateVideoOfUser(
    _id: string,
    user_id: string,
    dto: UserUpdateVideoDto,
  ): Promise<VideoResponseDto> {
    await this.validateUpdate(_id, user_id, dto.title);

    await this.findVideoByIDOfUser(_id, user_id);

    await this.videoModel.updateOne({ _id, user_id }, dto);

    return new VideoResponseDto(await this.findVideoByIDOfUser(_id, user_id));
  }

  public async remove(_id: string, user_id: string): Promise<void> {
    await this.findVideoByIDOfUser(_id, user_id);
    await this.videoModel.deleteOne({ _id, user_id });
  }
}

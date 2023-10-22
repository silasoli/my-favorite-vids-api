import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { Video, VideoDocument } from '../entities/video.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoResponseDto } from '../dto/response-video.dto';
import { EngineValidationVideosService } from './engine-validation-videos.service';

@Injectable()
export class AdminVideosService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
    private readonly engineValidationVideosService: EngineValidationVideosService,
  ) {}

  async validateCreate(user_id: string, title: string): Promise<void> {
    const existingVideo = await this.videoModel.findOne({ user_id, title });

    if (existingVideo)
      throw new ConflictException(
        'Esse usuario já tem um vídeo cadastrado com esse titulo.',
      );
  }

  public async create(dto: CreateVideoDto): Promise<VideoResponseDto> {
    const url = this.engineValidationVideosService.validateURL(dto);

    await this.validateCreate(dto.user_id, dto.title);

    const created = await this.videoModel.create({ ...dto, url });

    return new VideoResponseDto(created);
  }

  public async findAll(): Promise<VideoResponseDto[]> {
    const videos = await this.videoModel.find();
    return videos.map((video) => new VideoResponseDto(video));
  }

  private async findVideoByID(_id: string): Promise<Video> {
    const video = await this.videoModel.findById(_id);

    if (!video) throw new NotFoundException('Vídeo não encontrado.');

    return video;
  }

  public async findOne(_id: string): Promise<VideoResponseDto> {
    const video = await this.findVideoByID(_id);
    return new VideoResponseDto(video);
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

    if (existingVideo)
      throw new ConflictException(
        'Esse usuario já tem um vídeo cadastrado com esse titulo.',
      );
  }

  public async update(
    _id: string,
    dto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    await this.validateUpdate(_id, dto.user_id, dto.title);

    await this.findVideoByID(_id);

    const rawData = { ...dto };

    await this.videoModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findVideoByID(_id);
    await this.videoModel.deleteOne({ _id });
  }
}

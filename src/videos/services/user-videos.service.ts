import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { Video, VideoDocument } from '../entities/video.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoResponseDto } from '../dto/response-video.dto';

@Injectable()
export class UserVideosService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
  ) {}

  public async create(dto: CreateVideoDto): Promise<VideoResponseDto> {
    const created = await this.videoModel.create(dto);

    return new VideoResponseDto(created);
  }

  public async findAll(): Promise<VideoResponseDto[]> {
    const videos = await this.videoModel.find();
    return videos.map((video) => new VideoResponseDto(video));
  }

  private async findVideoByID(_id: string): Promise<Video> {
    const video = await this.videoModel.findById(_id);

    if (!video) throw new NotFoundException('Video not found');

    return video;
  }

  public async findOne(_id: string): Promise<VideoResponseDto> {
    const video = await this.findVideoByID(_id);
    return new VideoResponseDto(video);
  }

  public async update(
    _id: string,
    dto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
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

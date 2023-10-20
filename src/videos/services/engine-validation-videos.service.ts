import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import VideoPlatform from '../enums/video-type.enum';

@Injectable()
export class EngineValidationVideosService {
  private reelsURL = 'https://www.instagram.com/p/';
  private shortsURL = 'https://www.youtube.com/embed/';
  private tiktokURL = 'https://www.tiktok.com/embed/v2/';

  public validateURL(dto: CreateVideoDto): string {
    this.isUrlValidForPlatform(dto);
    const url = this.createUrlByPlatform(dto);
    if (!url || url.includes('undefined'))
      throw new BadRequestException(
        'A URL gerada é inválida ou contém um valor indefinido.',
      );
    return url;
  }

  private isUrlValidForPlatform(dto: CreateVideoDto) {
    const { platform, url } = dto;

    const isUrlValidForPlatform = {
      [VideoPlatform.REEL]: (url: string) =>
        url.includes('www.instagram.com/reel'),
      [VideoPlatform.TIKTOK]: (url: string) =>
        url.includes('www.tiktok.com/') && url.includes('/video/'),
      [VideoPlatform.SHORTS]: (url: string) =>
        url.includes('youtube.com/shorts'),
    };

    if (!isUrlValidForPlatform[platform](url))
      throw new ConflictException(
        'A URL fornecida não corresponde à plataforma selecionada.',
      );
  }

  private createUrlByPlatform(dto: CreateVideoDto) {
    const { platform, url } = dto;

    const createURLs = {
      [VideoPlatform.REEL]: (url: string) => {
        const startIndex = url.indexOf('reel/') + 5;
        const endIndex = url.indexOf('/', startIndex);
        const videoIdentifier = url.substring(startIndex, endIndex);

        return `${this.reelsURL}${videoIdentifier}/embed`;
      },
      [VideoPlatform.SHORTS]: (url: string) => {
        const startIndex = url.indexOf('shorts/') + 7;
        const endIndex = url.indexOf('?', startIndex);
        const videoIdentifier = url.substring(
          startIndex,
          endIndex !== -1 ? endIndex : undefined,
        );

        return `${this.shortsURL}${videoIdentifier}?autoplay=0&loop=1`;
      },
      [VideoPlatform.TIKTOK]: (url: string) => {
        const startIndex = url.indexOf('video/') + 6;
        const videoIdentifier = url.substring(startIndex);

        return `${this.tiktokURL}${videoIdentifier}`;
      },
    };

    return createURLs[platform] && createURLs[platform](url);
  }
}

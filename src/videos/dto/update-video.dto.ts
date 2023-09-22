import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}

export class UserUpdateVideoDto extends OmitType(UpdateVideoDto, [
  'user_id',
] as const) {}

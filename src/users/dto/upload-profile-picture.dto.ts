import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProfilePictureFileDto {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export class UploadProfilePictureDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: ProfilePictureFileDto | null;
}

export class UpdateProfilePictureDto {
  @ApiProperty({ required: false })
  @IsOptional()
  img: string | null;
}
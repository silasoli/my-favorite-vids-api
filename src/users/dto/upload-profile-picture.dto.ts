import { ApiProperty } from '@nestjs/swagger';

export class ProfilePictureFileDto {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export class UploadProfilePictureDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: ProfilePictureFileDto | null;
}

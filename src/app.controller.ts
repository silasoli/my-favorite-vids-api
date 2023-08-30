import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Docs')
@Controller('docs')
export class AppController {
  @Get()
  @Redirect('https://my-favorite-vids-api.vercel.app/docs')
  redirectToDocs() {}
}

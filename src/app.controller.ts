import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Docs')
@Controller('')
export class AppController {
  @Get()
  @Redirect('/docs')
  redirectToDocs() {}
}

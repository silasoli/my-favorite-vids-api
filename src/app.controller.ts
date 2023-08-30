import { Controller, Get, Header, HttpCode, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Docs')
@Controller('docs')
export class AppController {
  @Get()
  @HttpCode(301) // Use 301 for permanent redirect, or 302 for temporary
  @Header('Location', '/docs')
  redirectToDocs() { }
}
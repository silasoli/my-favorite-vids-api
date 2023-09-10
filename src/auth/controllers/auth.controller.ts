import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { AuthService } from '../services/auth.service';
import { Ilogin } from '../interfaces/Ilogin.interface';

@ApiTags('Session')
@Controller('session')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
  })
  @ApiBody({ type: UserLoginDto })
  @Post('/login')
  async login(@Body() loginDto: UserLoginDto): Promise<Ilogin> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) throw new ForbiddenException('Credenciais inválidas');

    return this.authService.login({ ...user });
  }
}

import { Injectable } from '@nestjs/common';
import { UserLoginDto } from '../dto/user-login.dto';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { Ilogin } from '../interfaces/Ilogin.interface';
import { IloginPayload } from '../interfaces/Ipayload.interface';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: UserLoginDto): Promise<Ilogin> {
    const user = await this.usersService.findByEmail(login.email);

    if (!user) return null;

    const passMatch = await this.usersService.comparePass(
      login.password,
      user.password,
    );

    if (!passMatch) return null;

    return { _id: user._id, username: user.username, email: user.email };
  }

  async login(user: Ilogin): Promise<IloginPayload> {
    const { _id, username, email } = user;

    const payload = { username, sub: _id };

    return new UserLoginResponseDto({
      id: _id,
      email,
      username,
      access_token: this.jwtService.sign(payload),
    });
  }

  async decodeAccessToken<T extends object>(accessToken: string): Promise<T> {
    return this.jwtService.verifyAsync(accessToken);
  }
}

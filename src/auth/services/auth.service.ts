import { Injectable } from '@nestjs/common';
import { UserLoginDto } from '../dto/user-login.dto';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { Ilogin } from '../interfaces/Ilogin.interface';
import { Ipayload } from '../interfaces/Ipayload.interface';

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

    return { _id: user._id, name: user.name, email: user.email };
  }

  async login(user: Ilogin): Promise<Ipayload> {
    const { _id, name, email } = user;
    const access_token = this.jwtService.sign({ name, sub: _id })

    return { _id, email, name, access_token };
  }

  async decodeAccessToken<T extends object>(accessToken: string): Promise<T> {
    return this.jwtService.verifyAsync(accessToken);
  }
}

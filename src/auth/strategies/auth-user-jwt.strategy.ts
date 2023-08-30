import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Ivalidate, IvalidateReturn } from '../interfaces/Ivalidate.interface';

@Injectable()
export class AuthUserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('USER_SECRET'),
    });
  }


  async validate(payload: Ivalidate): Promise<IvalidateReturn> {
    return { _id: payload.sub };
  }
}

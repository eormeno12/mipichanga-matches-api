import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../config';
import { StrategyName } from '../models/strategy-name.model';
import { PayloadToken } from '../models/token.model';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyName.JWT) {
  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  validate(payload: PayloadToken) {
    return payload;
  }
}

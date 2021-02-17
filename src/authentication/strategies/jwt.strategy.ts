import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;

    const user = await this.usersService.getById(id);

    if (!user) {
      return null;
    }

    return user;
  }
}

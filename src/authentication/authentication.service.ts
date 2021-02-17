import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupInput } from './inputs/signup.input';
import { PostgresErrorCodes } from '../database/postgres-error-codes';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
  ) {}

  // public getCookieWithJwtAccessToken(userId: number) {
  //   const payload: TokenPayload = { userId };
  //   const token = this.jwtService.sign(payload, {
  //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
  //     expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
  //   });
  //   return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
  //     'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
  //   )}`;
  // }
  //
  // public getCookieForLogout() {
  //   return [`Authentication=; HttpOnly; Path=/; Max-Age=0`];
  // }
  //
  // public getUserFromAuthenticationToken(token: string) {
  //   const payload: TokenPayload = this.jwtService.verify(token, {
  //     secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
  //   });
  //   if (payload.userId) {
  //     return this.usersService.getById(payload.userId);
  //   }
  // }

  public async signup(signupInput: SignupInput) {
    const hashedPassword = await bcrypt.hash(signupInput.password, 10);

    try {
      const user = await this.usersService.create({
        ...signupInput,
        password: hashedPassword,
      });
      const accessToken = await this.tokensService.generateAccessToken(user);
      const refreshToken = await this.tokensService.generateRefreshToken(
        user,
        60 * 60 * 24 * 30,
      );
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err?.code === PostgresErrorCodes.UniqueViolation) {
        throw new HttpException(
          'User with that email already exist.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  public async signin(signinInput: SignupInput) {
    const { email, password } = signinInput;

    const user = await this.usersService.getByEmail(email);

    const valid = await this.verifyPassword(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Login data is invalid');
    }

    const accessToken = await this.tokensService.generateAccessToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public async generateRefreshResponse(refresh: string) {
    const {
      user,
      token,
    } = await this.tokensService.createAccessTokenFromRefreshToken(refresh);
    return {
      user,
      accessToken: token,
    };
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  protected async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

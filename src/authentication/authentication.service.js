var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCodes } from '../database/postgres-error-codes';
let AuthenticationService = class AuthenticationService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    getCookieWithJwtAccessToken(userId) {
        const payload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }
    getCookieForLogout() {
        return [`Authentication=; HttpOnly; Path=/; Max-Age=0`];
    }
    getUserFromAuthenticationToken(token) {
        const payload = this.jwtService.verify(token, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
        if (payload.userId) {
            return this.usersService.getById(payload.userId);
        }
    }
    async signup(signupInput) {
        const hashedPassword = await bcrypt.hash(signupInput.password, 10);
        try {
            return await this.usersService.create({
                ...signupInput,
                password: hashedPassword,
            });
        }
        catch (err) {
            if (err?.code === PostgresErrorCodes.UniqueViolation) {
                throw new HttpException('User with that email already exist.', HttpStatus.BAD_REQUEST);
            }
        }
    }
    async getAuthenticatedUser(email, plainTextPassword) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        }
        catch (err) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPassword(plainTextPassword, hashedPassword) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }
};
AuthenticationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService,
        ConfigService])
], AuthenticationService);
export { AuthenticationService };

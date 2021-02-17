var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/models/user.model';
import { AuthenticationService } from './authentication.service';
import { Authentication } from './models/authentication.model';
import { SignupInput } from './inputs/signup.input';
let AuthenticationResolver = class AuthenticationResolver {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async signup(signupInput) {
        return this.authenticationService.signup(signupInput);
    }
    async me() {
        return {
            email: 'ads',
        };
    }
};
__decorate([
    Mutation(() => Authentication),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignupInput]),
    __metadata("design:returntype", Promise)
], AuthenticationResolver.prototype, "signup", null);
__decorate([
    Query(() => User),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthenticationResolver.prototype, "me", null);
AuthenticationResolver = __decorate([
    Resolver(() => User),
    __metadata("design:paramtypes", [AuthenticationService])
], AuthenticationResolver);
export { AuthenticationResolver };

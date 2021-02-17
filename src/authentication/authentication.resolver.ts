import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/models/user.model';
import { AuthenticationService } from './authentication.service';
import { Authentication } from './models/authentication.model';
import { SignupInput } from './inputs/signup.input';
import { SigninInput } from './inputs/signin.input';
import { RefreshInput } from './inputs/refresh.input';

@Resolver(() => User)
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => Authentication)
  async signup(@Args('input') signupInput: SignupInput) {
    return this.authenticationService.signup(signupInput);
  }

  @Mutation(() => Authentication)
  async signin(@Args('input') signinInput: SigninInput) {
    return this.authenticationService.signin(signinInput);
  }

  @Mutation(() => Authentication)
  async refresh(@Args('input') refreshInput: RefreshInput) {
    const { refreshToken } = refreshInput;
    return this.authenticationService.generateRefreshResponse(refreshToken);
  }
}

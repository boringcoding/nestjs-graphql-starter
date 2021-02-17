import { Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../authentication/jwt.guard';
import { CurrentUser } from '../authentication/current-user.decorator';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return this.usersService.getById(user.id);
  }
}

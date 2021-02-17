import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class Authentication {
  @Field()
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken?: string;
}

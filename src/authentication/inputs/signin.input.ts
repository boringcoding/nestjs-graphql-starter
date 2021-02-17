import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SigninInput {
  @Field()
  @IsNotEmpty({ message: 'An email is required.' })
  readonly email: string;

  @Field()
  @IsNotEmpty({ message: 'A password is required.' })
  readonly password: string;
}

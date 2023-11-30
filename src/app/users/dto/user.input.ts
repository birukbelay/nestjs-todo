import { InputType, PartialType, PickType, ObjectType } from '@nestjs/graphql';
import { User } from '@/app/users/entities/user.entity';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { AuthToken } from '@/common/types.model';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'name',
  'password',
]) {
  name: string;
  @IsEmail()
  email: string;
  password: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}

@InputType()
export class LoginUserInput {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}

@ObjectType()
export class AuthTokenResponse {
  authToken: AuthToken;

  user?: User;
  error?: string;
}

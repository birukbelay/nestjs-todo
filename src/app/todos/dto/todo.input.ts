import {
  InputType,
  PartialType,
  PickType,
  ObjectType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import { Todo } from '@/app/todos/entities/todo.entity';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { AuthToken } from '@/common/types.model';

@InputType()
export class CreateTodoInput extends PickType(Todo, [
  'title',
  'content',
  'done',
]) {
  title: string;
  content?: string;
  userId: number;

  done: boolean;
}

@InputType()
export class TodoOrder {
  @Field((type) => SortOrder)
  createdAt: SortOrder;
}

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {}
@InputType()


@InputType()
export class LoginTodoInput {
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

  todo?: Todo;
  error?: string;
}

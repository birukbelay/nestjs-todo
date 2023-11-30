import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthTokenResponse, CreateUserInput, LoginUserInput, UpdateUserInput } from './dto/user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createOne(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.register(createUserInput);
  }
  @Mutation(() => AuthTokenResponse)
  login(@Args('createUserInput') input: LoginUserInput) {
    return this.usersService.login(input);
  }

  @Query(() => [User], { name: 'findUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('id') id: number, @Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}

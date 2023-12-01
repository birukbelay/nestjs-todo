import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import {

  CreateTodoInput,
 
  TodoOrder,
  UpdateTodoInput,
} from './dto/todo.input';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GqlJwtGuard } from '@/providers/guards/guard.gql';
import { AllowedRoles } from '@/providers/guards/roles.decorators';
import { RoleType } from '@/common/types.model';
import { logTrace } from '@/common/logger';
@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todosService: TodoService) {}

  @UseGuards(GqlJwtGuard)
  @Mutation(() => Todo, { name: 'CreateTodo' })
  createOne(@Context() ctx, @Args('createTodoInput') createTodoInput: CreateTodoInput) {
    /**
     * this will make only authenticated users to create todos
     */
    const request = ctx.req;
    const user = request['user']
    if(!user)throw new HttpException('Unauthorized access. User not authenticated.', HttpStatus.FORBIDDEN);
    createTodoInput.userId = user.id;
    return this.todosService.create(createTodoInput);
  }

  


  @Query(() => [Todo], { name: 'findTodos' })
  findAll() {
    return this.todosService.findAll();
  }

  @AllowedRoles(RoleType.USER)
  @UseGuards(GqlJwtGuard)
  @Query(() => [Todo])
  todosByUserId( @Args('id') id: number,) {
    return this.todosService.findByUserId(id);
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.todosService.findOne(id);
  }

  @Mutation(() => Todo)
  updateTodo(
    @Args('id') id: number,
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
  ) {
    return this.todosService.update(id, updateTodoInput);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todosService.remove(id);
  }



  @UseGuards(GqlJwtGuard)
  @Query((returns) => [Todo], { name: 'queryTodos' })
  paginate(
    @Args('searchString', { nullable: true }) searchString: string,
    @Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number,
    @Args('orderBy', { nullable: true }) orderBy: TodoOrder,
    @Args('userId') id: number,
  ) {    
    if(limit<0) limit =20
    if (limit>30) limit=30
    
    if(page<1) page=1

    let skip = limit * (page-1)
    logTrace(limit,skip)
    logTrace("page",page)
    return this.todosService.paginate(searchString, limit, skip, orderBy, id)
  }
}

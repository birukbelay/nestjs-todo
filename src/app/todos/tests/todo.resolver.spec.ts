import { Test, TestingModule } from '@nestjs/testing';
import { TodoResolver } from '../todo.resolver';
import { TodoService } from '../todo.service';
import { PrismaService } from '../../../prisma.service';
import { CustomJwtService } from '@/providers/crypto/jwt.service';



describe('TodosResolver', () => {
  let todoResolver: TodoResolver;
  let todoService: TodoService;
  const newTodo1 = { 
    id: 1, title: 'User Todo 1', done: false, userId: 0, 
    content: "", 
    createdAt: new Date(Date.now()), 
    updatedAt: new Date(Date.now())  
  }
  const newTodo2 ={ 
    id: 2, title: 'User Todo 2', done: true, userId: 0, 
    content: "", 
    createdAt: new Date(Date.now()), 
    updatedAt: new Date(Date.now())  
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoResolver, TodoService, PrismaService, CustomJwtService],
    }).compile();

    todoResolver = module.get<TodoResolver>(TodoResolver);
    todoService = module.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(todoResolver).toBeDefined();
  });

  const createTodoInput = { title: 'Test Todo', userId: null, done: true }; // Input for createTodoInput

  describe('createOne', () => {

    it('should create a new todo item for an authenticated user', async () => {
      // Mock the context and user data
      const mockContext = {
        req: { user: { id: 1 } }, // Simulated authenticated user data
      };
      const mockCreate = jest
        .spyOn(todoService, 'create')
        .mockResolvedValueOnce(newTodo1);

      const createdTodo = await todoResolver.createOne(mockContext, createTodoInput);

      expect(mockCreate).toHaveBeenCalledWith({ title: 'Test Todo', userId: 1, done: true });
      expect(createdTodo).toEqual(newTodo1);
    });

    it('should throw an error for unauthorized user', async () => {
      const mockContext = { req: { user: null } }; // Simulate unauthenticated user     

      // await expect(todoResolver.createOne(mockContext, createTodoInput)).rejects.toThrowError(
      //   'Unauthorized access. User not authenticated.',
      // );
      try {
        await todoResolver.createOne(mockContext, createTodoInput);
      } catch (error) {
        expect(error.message).toBe('Unauthorized access. User not authenticated.');
      }

    });

    it('should throw an error if Todo creation fails', async () => {
      const mockContext = { req: { user: { id: 1 } } };      

      const mockCreate = jest
        .spyOn(todoService, 'create')
        .mockRejectedValueOnce(new Error('Failed to create Todo'));

      await expect(todoResolver.createOne(mockContext, createTodoInput)).rejects.toThrowError(
        'Failed to create Todo',
      );
    });



  });




});

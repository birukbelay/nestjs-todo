import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { PrismaService } from '@/prisma.service';
import { SortOrder, TodoOrder } from '../dto/todo.input';


describe('TodosService', () => {
  const prismaServiceMock = {
    todo: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  let todoService: TodoService;

  let prismaService: PrismaService;


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

  // creating a mock provider for the todos service with fake data
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  // This is one way to mock the Prisma service
  it('should find a todo by unique input', async () => {
    // Mock the behavior of prismaService.todo.findUnique
    prismaServiceMock.todo.findUnique.mockResolvedValue({
      id: 1,
      title: 'Sample Todo',
    });

    const result = await todoService.todo({ id: 1 });
    expect(result).toEqual({ id: 1, title: 'Sample Todo' });

    // Verify that prismaService.todo.findUnique was called with the correct argument
    expect(prismaServiceMock.todo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  // Find one test
  describe('findOne', () => {
    it('should find a todo item by ID', async () => {
      // Mock the behavior of prismaService.todo.findUnique
      const mockFindUnique = jest
        .spyOn(prismaService.todo, 'findUnique')
        .mockResolvedValueOnce(newTodo1);

      const foundTodo = await todoService.findOne(1);

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(foundTodo).toEqual(newTodo1);
    });
  });


  describe('create', () => {
    it('should create a new todo item', async () => {
      const mockCreate = jest
        .spyOn(prismaService.todo, 'create')
        .mockResolvedValueOnce(
          { id: 1,
            title: 'Test Todo', 
            done: false, 
            userId: 0, 
            content: "", 
            createdAt: new Date(Date.now()), 
            updatedAt: new Date(Date.now()) 
          }
            
            );

      const newTodo = await todoService.create({
        title: 'Test Todo',
        userId: 0,
        done: false
      });

      expect(mockCreate).toHaveBeenCalledWith({ data: {
        title: 'Test Todo',
        userId: 0,
        done: false
      } });
      expect(newTodo.id).toEqual(1);
    });

    
  });



  describe('findByUserId', () => {
    it('should find todos for a specific user', async () => {
      const userId = 1;
      
      const mockFindMany = jest
        .spyOn(prismaService.todo, 'findMany')
        .mockResolvedValueOnce([
          newTodo1,
          newTodo2,
        ]);

      const userTodos = await todoService.findByUserId(userId);

      expect(mockFindMany).toHaveBeenCalledWith({ where: { userId } });
      expect(userTodos).toEqual([
        newTodo1,
        newTodo2,
      ]);
    });
  });


  describe('update', () => {
    it('should update a todo item', async () => {
      const mockUpdate = jest
        .spyOn(prismaService.todo, 'update')
        .mockResolvedValueOnce(newTodo1);

      const updatedTodo = await todoService.update(1, { title: 'Updated Todo', done: true });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Todo', done: true },
      });
      expect(updatedTodo).toEqual(newTodo1);
    });
  });

  describe('remove', () => {
    it('should remove a todo item', async () => {
      const mockDelete = jest.spyOn(prismaService.todo, 'delete').mockResolvedValueOnce(newTodo1);

      const deletedTodo = await todoService.remove(1);

      expect(mockDelete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(deletedTodo).toEqual(newTodo1);
    });
  });


  describe('paginate', () => {
    it('should paginate todo items', async () => {
      const mockFindMany = jest
        .spyOn(prismaService.todo, 'findMany')
        .mockResolvedValueOnce([
         newTodo1,
          newTodo2
        ]);

      const paginatedTodos = await todoService.paginate('', 10, 0, { createdAt: SortOrder.asc}, 123);

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { OR: [{ title: { contains: '' } }], userId: 123 },
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'asc' },
      });
      expect(paginatedTodos).toEqual([
       newTodo1,
        newTodo2,
      ]);
    });
  });


});

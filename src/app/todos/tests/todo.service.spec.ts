import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { PrismaService } from '@/prisma.service';

const prismaServiceMock = {
  todo: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TodosService', () => {
  let service: TodoService;

  let prismaService: PrismaService;

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

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a todo by unique input', async () => {
    // Mock the behavior of prismaService.todo.findUnique
    prismaServiceMock.todo.findUnique.mockResolvedValue({
      id: 1,
      title: 'Sample Todo',
    });

    const result = await service.todo({ id: 1 });
    expect(result).toEqual({ id: 1, title: 'Sample Todo' });

    // Verify that prismaService.todo.findUnique was called with the correct argument
    expect(prismaServiceMock.todo.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const mockCreate = jest
        .spyOn(prismaService.todo, 'create')
        .mockResolvedValueOnce({ id: 1, title: 'Test Todo', done: false, userId: 0, content: "", createdAt: new Date(Date.now()), updatedAt: new Date(Date.now()) });

      const newTodo = await service.create({
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

    // Additional test cases for different scenarios
  });




});

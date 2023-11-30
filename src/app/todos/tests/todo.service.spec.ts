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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should find a todo by unique input', async () => {
    // Mock the behavior of prismaService.todo.findUnique
    prismaServiceMock.todo.findUnique.mockResolvedValue({ id: 1, title: 'Sample Todo' });

    const result = await service.todo({ id: 1 });
    expect(result).toEqual({ id: 1, title: 'Sample Todo' });

    // Verify that prismaService.todo.findUnique was called with the correct argument
    expect(prismaServiceMock.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});

import { Injectable } from '@nestjs/common';
import { CreateTodoInput, TodoOrder, UpdateTodoInput } from './dto/todo.input';
import { Todo } from './entities/todo.entity';
import { PrismaService } from '@/prisma.service';
import { Todo as PTodo, Prisma } from '@prisma/client';

import { CryptoService } from '@/providers/crypto/crypto.service';
import { CustomJwtService } from '@/providers/crypto/jwt.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async todo(
    todoWhereUniqueInput: Prisma.TodoWhereUniqueInput,
  ): Promise<PTodo | null> {
    return this.prisma.todo.findUnique({
      where: todoWhereUniqueInput,
    });
  }

  async create(data: CreateTodoInput): Promise<Todo> {
    const createUsr = await this.prisma.todo.create({
      data,
      // data: { email: data.email, name: data.name, password: data.password },
    });
    return createUsr;
  }

  async findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id: Number(id) } });
  }

  async findByUserId(userId: number): Promise<Todo[]> {
    return this.prisma.todo.findMany({ where: { userId: Number(userId) } });
  }

  async update(id: number, data: UpdateTodoInput) {
    return this.prisma.todo.update({
      where: { id: Number(id) },
      data: { ...data },
    });
  }

  remove(id: number): Promise<Todo> {
    return this.prisma.todo.delete({
      where: { id: Number(id) },
    });
  }

  async paginate(
    searchString: string,
    take,
    skip: number,
    orderBy: TodoOrder,
    userId: number,
  ) {
    const or = searchString
      ? {
          OR: [
            { title: { contains: searchString } },
            { content: { contains: searchString } },
          ],
          userId: userId || undefined,
        }
      : {};

    return this.prisma.todo.findMany({
      where: {
        ...or,
      },
      take: take || undefined,
      skip: skip || undefined,
      orderBy: orderBy || undefined,
    });
  }
}

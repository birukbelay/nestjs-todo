
import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsEmail } from 'class-validator';

@ObjectType()
export class Todo implements Prisma.TodoCreateInput {
  id: number;
  
  title: string;
  content?: string;

  userId: number

  done: boolean;

  @Field((type) => Date)
  createdAt: Date

  @Field((type) => Date)
  updatedAt: Date
}



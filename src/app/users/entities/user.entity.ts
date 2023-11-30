
import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsEmail } from 'class-validator';

@ObjectType()
export class User implements Prisma.UserCreateInput {
  id: number;
  @IsEmail()
  email: string;
  name?: string;

  role: string;
  @HideField()
  password: string;
}

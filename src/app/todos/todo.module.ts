import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { PrismaService } from '@/prisma.service';
import { CryptoModule } from '@/providers/crypto/crypto.module';
import { GuardsModule } from '@/providers/guards/guards.module';

@Module({
  imports: [CryptoModule, GuardsModule],
  providers: [TodoResolver, TodoService, PrismaService],
})
export class TodoModule {}

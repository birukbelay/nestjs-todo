import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '@/prisma.service';
import { CryptoModule } from '@/providers/crypto/crypto.module';
import { GuardsModule } from '@/providers/guards/guards.module';

@Module({
  imports:[
     CryptoModule,
    GuardsModule,],
  providers: [UsersResolver, UsersService, PrismaService]
})
export class UsersModule {}

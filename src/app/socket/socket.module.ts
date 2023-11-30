// socket.module.ts
import { Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { TodoModule } from '../todos/todo.module';

@Module({
    imports:[TodoModule],
  providers: [SocketGateway],
})
export class SocketIOModule {}

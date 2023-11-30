// socket.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoService } from '../todos/todo.service';
import { UpdateTodoInput } from '../todos/dto/todo.input';

class updateTodoSocket{
    body: UpdateTodoInput
    id: number
}
@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
export class SocketGateway {
    constructor(private readonly todosService: TodoService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('updateTodo')
  async updateTodo(
    @MessageBody() data: updateTodoSocket,
    @ConnectedSocket() client: Socket
  ): Promise<WsResponse<unknown>> {
    const updated = await this.todosService.update(data.id, data.body);

    const event = 'todoUpdated';
    

    return { event, data: updated }

    // // Emit user status back to the client
    // this.server.emit('todoUpdated', { data: updated });
  }
}

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  constructor(
    private readonly JwtService: JwtService,
    private readonly messagesWsService: MessagesWsService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    //* * esto es para validar si es un token valido o no
    let payload: JwtPayload
    try{
      payload = this.JwtService.verify(token); 
      await this.messagesWsService.registerClient(client, payload.id);
    }catch(error){
      client.disconnect();
      return;
    }
    //console.log({payload});

    this.wss.emit('clients-uptaded',this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeCliente(client.id);
    this.wss.emit('clients-uptaded',this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client:Socket, payload: NewMessageDto){

    //! Emite unicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName:'YO',
    //   message: payload.message || 'no-message'
    // });

    //! Emite a todos los clientes conectados menos al que envio el mensaje.
    // client.broadcast.emit('message-from-server', {
    //   fullName:'YO',
    //   message: payload.message || 'no-message'
    // });

    //! Emite un mensaje a todos los clientes conectados, incluyendo el que mando el mensaje
    this.wss.emit('message-from-server', {
      fullName:this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message'
    });
  }
}



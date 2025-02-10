import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectClients{
    [id:string]: Socket;

}


@Injectable()
export class MessagesWsService {

    private connectedClients = {};

    registerClient(client: Socket){
        this.connectedClients[client.id] = client;
    }

    removeCliente(clienteId: string){
        delete this.connectedClients[clienteId];
    }

    getConnectedClients():number{
        return Object.keys(this.connectedClients).length;
    }
}

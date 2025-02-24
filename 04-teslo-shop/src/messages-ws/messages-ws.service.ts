import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectClients{
    [id:string]: {
        socket: Socket,
        user: User,
    };

}


@Injectable()
export class MessagesWsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    private connectedClients = {};

    async registerClient(client: Socket, userId: string){
        const user = await this.userRepository.findOneBy({id:userId});
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is not active');
        this.checkUserConnection(user);
        
        this.connectedClients[client.id] = {
            socket:client, 
            user:user,
        };
    }

    removeCliente(clienteId: string){
        delete this.connectedClients[clienteId];
    }

    getConnectedClients():string[]{
       // console.log(this.connectedClients);
        return Object.keys(this.connectedClients);
    }

    getUserFullNameBySocketId(socketId: string){
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User){
        for(const clientId of Object.keys(this.connectedClients)){
            const connectClient = this.connectedClients[clientId];
            if(connectClient.user.id === user.id){
                connectClient.socket.disconnect();
                break;
            }
        }
    }
}

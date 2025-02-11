import {Manager, Socket } from 'socket.io-client'
let socket:Socket;

export const connectToServer = (token:string) => {
    const manager = new Manager('localhost:3000/socket.io/socket.io.js',{
        extraHeaders:{
            hola:'mundo',
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');
    addListeners();

}


const addListeners = () => {
    const clientesUl = document.querySelector('#clientes-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector('#messages-ul')!;
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;

    //todo: #clientes-ul
    //on para escuchar info del servidor y emit para habalr con el servidor
    socket.on('connect', ()=> {
        serverStatusLabel.innerText = 'connected';
    });

    socket.on('disconnect', ()=> {
        serverStatusLabel.innerText = 'disconnected';
    });
   
    socket.on('clients-uptaded', (clients: string[]) =>{
        let clientsHtml = '';
        clients.forEach(client => {
            clientsHtml += `
            <li>${client}</li>
            `;
        });
        clientesUl.innerHTML = clientsHtml;
    });


    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client',{
            id: 'YO!', 
            message: messageInput.value
        });
        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: {fullName:string, message:string}) => {
        const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;

        messagesUl.append(li);
    });

}
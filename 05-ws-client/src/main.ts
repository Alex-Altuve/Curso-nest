import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client </h2>
    <input id="jwt-token" placeholder="Json Web Token" />
    <button id="btn-connect">Connect</button>

    <br/>
    <span id= "server-status">offline</span>
    <ul id="clientes-ul"></ul>
    <form id="message-form">
      <input placeholder="message" id="message-input"/>
    </form>

    <h3>Messages<h3>
    <ul id="messages-ul"></ul>

  </div>
`

const JwtToken = document.querySelector<HTMLInputElement>('#jwt-token');
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect');

if (btnConnect && JwtToken) {
  btnConnect.addEventListener('click', () => {
    if(JwtToken.value.trim().length <= 0) return alert('Enter a valid JWT Token');
    connectToServer(JwtToken.value.trim());
  });
}
//connectToServer();
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

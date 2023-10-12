import { io } from 'socket.io-client';

const socket = io('http://localhost:3001')

socket.on('message', (newMessage) => {
    console.log("SOCKET MESSAGE")
});

export {socket}
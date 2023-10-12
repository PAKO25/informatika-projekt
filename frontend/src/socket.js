import { io } from 'socket.io-client';

const socket = io()

socket.on('message', (newMessage) => {
    console.log("SOCKET MESSAGE")
});

export {socket}
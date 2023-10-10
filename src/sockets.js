const { Server } = require("socket.io");
const prod = process.env.PROD || false;
let httpServer;
if (prod) {
    httpServer = require("./server.js")
} else {
    httpServer = require("./dev-server.js")
}

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("message", "Welcome to the chat room!");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
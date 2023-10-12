const prod = process.env.PROD || false;

if (prod) {
    var {io} = require("./server.js")
} else {
    var {io} = require("./dev-server.js")
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on('getMessages', (data) => {
        console.log(data);
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
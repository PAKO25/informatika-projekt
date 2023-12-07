const { checkToken } = require("./jwt.js");

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
        socket.emit('newMessages', [
            {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"},
            {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"},
            {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"},
            {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"},
            {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"}, {date: "xx", sender: "yy", text:"lol123"},
        ])
    })

    socket.on('newMessage', async (data) => {
        let user = await checkToken(data.token);
        if (user == undefined) return;

        const { username } = user;
        io.emit('newMessages', {date: "xx", sender: username, text:data.text})
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
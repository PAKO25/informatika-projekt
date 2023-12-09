const { getMessages, addMessage } = require("./db.js");
const { checkToken } = require("./jwt.js");

const prod = process.env.PROD || false;

if (prod) {
    var {io} = require("./server.js")
} else {
    var {io} = require("./dev-server.js")
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on('getMessages', async (data) => {
        let user = await checkToken(data.token);
        if (user == undefined) {
            socket.emit('invalidToken', true)
            return;
        }

        let messages = await getMessages(data.range)
        socket.emit('newMessages', messages)
    })

    socket.on('sendMessage', async (data) => {
        let user = await checkToken(data.token);
        if (user == undefined) {
            socket.emit('invalidToken', true)
            return;
        }

        const { username } = user;
        let message = {text: data.text, username: username, date: new Date().getTime()}
        await addMessage(message)
        io.emit('newMessages', [message])
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
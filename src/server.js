import http from "http"
import SocketIO from "socket.io"
import express from "express"

const app = express();

app.set("view engine", "pug") // 확장자 지정
app.set("views", __dirname + "/views"); // 폴더 경로 지정
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_, res) => res.render("home"))
app.get("/*", (_, res) => res.redirect("/"))

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket ${event}`)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName)
        done();
        socket.to(roomName).emit("welcome")
    })
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => socket.to(room).emit('bye'))
    })
    socket.on('new_message', (msg, room, done) => {
        socket.to(room).emit('new_message', msg)
        done();

    })
})



// const wss = new WebSocket.Server({ server })
// const sockets = []

// function handleConnection(socket) {
//     sockets.push(socket)
//     socket['nickname'] = 'Anon'
//     console.log("connected to Browser ✅")
//     socket.on("close", () => console.log("Disconnected from Browser ❌"))
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString())
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`))
//                 break
//             case "nickname":
//                 socket['nickname'] = message.payload;
//                 break
//         }
//     })
// }

// wss.on("connection", handleConnection)

const handleListen = () => console.log('Listening on http://localhost:3000')
httpServer.listen(3000, handleListen);
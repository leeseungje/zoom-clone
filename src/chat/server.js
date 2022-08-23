import http from "http"
import { Server } from "socket.io"
import express from "express"
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug") // 확장자 지정
app.set("views", __dirname + "/views"); // 폴더 경로 지정
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_, res) => res.render("home"))
app.get("/*", (_, res) => res.redirect("/"))

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(wsServer, {
    auth: false
})

function publicRooms() {
    const {
        sockets: {
            adapter: {
                sids, rooms
            },
        }
    } = wsServer
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    })
    return publicRooms
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "누군가";
    console.log(socket["nickname"])
    socket.onAny((event) => {
        console.log(`Socket ${event}`)
    })
    socket.on("enter_room", (roomName, nickName, done) => {
        socket.join(roomName)
        socket["nickname"] = nickName;
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName))
        wsServer.sockets.emit("room_change", publicRooms())
    })
    socket.on('disconnecting', () => { // 나가기전 한번 실행
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
        );

    })
    socket.on('disconnect', () => { // 나간 후 실행
        wsServer.sockets.emit("room_change", publicRooms())
    })
    socket.on('new_message', (msg, roomName, done) => {
        socket.to(roomName).emit('new_message', `${socket.nickname}: ${msg}`)
        done();

    })
    socket.on('nickname', (nickname) => (socket['nickname'] = nickname))
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
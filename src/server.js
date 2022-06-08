import http from "http"
import WebSocket from "ws";
import express from "express"

const app = express();

app.set("view engine", "pug") // 확장자 지정
app.set("views", __dirname + "/views"); // 폴더 경로 지정
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_, res) => res.render("home"))
app.get("/*", (_, res) => res.redirect("/"))

const handleListen = () => console.log('locall 호스트 3000')

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })

function handleConnection(socket) {
    console.log("connected to Browser ✅")
    socket.on("close", () => console.log("Disconnected from Browser ❌"))
    socket.on("message", (message) => { console.log(message.toString()) })
    socket.send('hello!!!')
}

wss.on("connection", handleConnection)

server.listen(3000, handleListen)
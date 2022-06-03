import express from "express"

const app = express();

app.set("view engine", "pug") // 확장자 지정
app.set("views", __dirname + "/views"); // 폴더 경로 지정
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"))

console.log("Hello")

const handleListen = () => console.log('locall 호스트 3000')

app.listen(3000, handleListen)
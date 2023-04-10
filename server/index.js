const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRoutes = require("./Routes/AuthRoutes")
const userRoute = require("./Routes/UserRoute")
const messageRoute = require("./Routes/MessagesRoute")
const chatRoute = require("./Routes/ChatRoute")
const MumbleAIRoute = require("./Routes/MumbleAIRoute")
// const cookieParser = require("cookie-parser")
const socket = require("socket.io")

// "type": "module", in package.json allows to use import instead of require


const app = express()
require("dotenv").config()


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT ${process.env.PORT}`)
})

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("DB Connection Successfull")
})
.catch((err) => {
    console.log(err.message)
})

app.use(
    cors({
        origin: ["http://localhost:3000"],
        method: ["GET","POST"],
        credentials: true,
    })
)

// app.use(cookieParser())
app.use(express.json())

app.use("/", authRoutes)
app.use("/user", userRoute)
app.use("/messages", messageRoute)
app.use("/chat", chatRoute)
app.use("/mumbleai", MumbleAIRoute)








// socket
const io = socket(server, {
    cors : {
        origin : "http://localhost:3000",
        credentials : true,
    },
    // pingTimeout : 60000, // close connection to save the bandwidth
})

global.onlineUsers = new Map()

io.on("connection", (socket) => {

    socket.on("setup", (userId) => {
        socket.join(userId)
        console.log("Connected",userId)
        socket.emit("connected")
    })

    socket.on("join-room", (chatId) => {
        socket.join(chatId)
        console.log("User Joined Room : ", chatId)
    })

    socket.on("typing", (room) => {
        console.log("TYpingg.....")
        socket.in(room).emit("typing")})
    socket.on("stop-typing", (room) => {
        console.log("STOP")
        socket.in(room).emit("stop-typing")})

    socket.on("new-message", (newMessage) => {
        let chat = newMessage.chatid

        if(!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user) => {
            if(user._id == newMessage.sender._id) return

            socket.in(user._id).emit("message-received", newMessage)
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userId)
    })
})
// end
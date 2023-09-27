import express from 'express'
import http from 'http'
import {Server} from "socket.io"
import cors from 'cors'
import router from "./route";
import {addUser, findUser, getRoomsUsers, removeUser} from "./users";

// const route=require("./route")
const app = express();
const server = http.createServer(app);
app.use(cors({origin: "*"}))
app.use(router)
const PORT = process.env.PORT || 3009

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})//socket создали

const messages = [
    {message: "Hello Valek", id: "23f441", user: {id: "sdgsdgs", name: "Valek Tem"}},
    {message: "Hello", id: "23f440", user: {id: "sdgsdgs", name: "Tem"}},
    {message: "Hello Petr Yoyo", id: "23f447", user: {id: "sdgsdgs", name: "Petr"}},
]
const usersState = new Map()

io.on('connection', (socketChanel) => {// socketChanel подписался на событие connection, и когда оно произойдет выполняется код ниже, клиентское сообщение и имя отправлено, создаем аноним пользователя
    // usersState.set(socketChanel, {id: new Date().getTime().toString(), name: "anon"})
    socketChanel.on("join", ({name, room}) => {
        socketChanel.join(room)// подписались на событие по комнатам
        const {user, isExist} = addUser({name, room})
        console.log(isExist)
        let userMessage = isExist
            ? `${user.name}, here you go again`
            : `Hi hi my name ${user.name}`
        socketChanel.emit("message", {
            data: {user: {name: "Admin"}, message: userMessage}
        })
        socketChanel.broadcast.to(user.room).emit("message", {
            data: {user: {name: "Admin"}, message: `${user.name} has joined`}
        })
        io.to(user.room).emit("room", {data: {users: getRoomsUsers(user.room)}})
    })
    socketChanel.on("sendMessage", ({message, params}) => {
        const user = findUser(params)
        console.log(user)
        if (user) {
            io.to(user.room).emit("message", {data: {user, message}})
        }
        console.log("message", message)
    })
    socketChanel.on("leftRoom", ({params}) => {
        const user = removeUser(params)
        console.log(user)
        if (user) {
            io.to(user.room).emit("message", {data: {user: {name:"Admin"}, message: `${user.name} hsa left`}})

            io.to(user.room).emit("room", {data: {users: getRoomsUsers(user.room)}})
        }
    })
    socketChanel.on('disconnect', () => {
        // usersState.delete(socketChanel)
        console.log('disconnect')
    })
    // socketChanel.on('client-name-send', (name: string) => {
    //     if (typeof name !== "string") {
    //         return
    //     }
    //     const user = usersState.get(socketChanel)//присваиваем имя с фронта
    //     user.name = name
    // })
    // socketChanel.on('client-typed', () => {
    //     //сделать рассылку всем кроме себя
    //     socketChanel.broadcast.emit('user-is-typing', usersState.get(socketChanel))
    // })

    // socketChanel.on('client-message-send', (message: string, sucsessFn) => {
    //     // добавили проверку на длину сообщения, и показать этот error на front
    //     if (typeof message !== "string" || message.length > 20) {
    //         return sucsessFn("Message length should be less than 20")
    //     }
    //     const user = usersState.get(socketChanel)
    //     // console.log(message)
    //     let messageItem = {message: message, id: new Date().getTime().toString(), user: {id: user.id, name: user.name}}
    //     messages.push(messageItem)
    //
    //     socketChanel.emit('new-message-send', messageItem)//отправлем это сообщение
    //     return sucsessFn(null)
    // })

    // socketChanel.emit('init-messages-published', messages, (data: string) => {
    //     console.log("Init messages received" + data)
    // })

    console.log('a user connected');
});

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});



const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let messages = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // send old messages
    socket.emit("load_messages", messages);

    // receive new message
    socket.on("send_message", (msg) => {
        messages.push(msg);
        io.emit("new_message", msg); // send to everyone instantly
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running");
});

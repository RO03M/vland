import express from "express";
import http from "node:http"
import { Server } from "socket.io";

export const PORT = 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", function(request, response) {
    console.log("teste");
    response.json({
        hjola: "q tal"
    })
});

io.on("connection", function(socket) {
    console.log("User connected", socket.id);
    socket.broadcast.emit("newplayer", { id: socket.id });
    socket.on("walk", function(message) {
        console.log(`${socket.id} walked!`, message)
        socket.broadcast.emit("walk", message)
    });

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id)
    });
});


server.listen(PORT, function() {
    console.log("Listening to port ", PORT);
});

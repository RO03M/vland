import express from "express";
import http from "node:http"
import { Server } from "socket.io";

export const PORT = 8000;

interface Player {
    id: string;
    username: string;
}

const players: Map<string, Player> = new Map();

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
    const username = socket.handshake.query.username;
    if (username === undefined || typeof username !== "string") {
        socket.disconnect();
        return;
    }

    console.log(`${username} connected!`);

    socket.emit("initial_players", [...players]);
    players.set(socket.id, {
        id: socket.id,
        username
    });

    console.log("aloha");
    socket.broadcast.emit("newplayer", { id: socket.id });

    socket.on("walk", function(message) {
        socket.broadcast.emit("walk", message)
    });

    socket.on("disconnect", () => {
        const player = players.get(socket.id);
        console.log(`${player?.username} ${socket.id} disconnected`);
        players.delete(socket.id);
        io.emit("player_disconnected", socket.id);
    });
});


server.listen(PORT, function() {
    console.log("Listening to port ", PORT);
});

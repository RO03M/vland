import { Game, SystemMode } from "./core/game";
import { PlayerPlugin } from "./plugins/player-plugin";
import { io } from "socket.io-client";
import { MultiplayerHandlerPlugin } from "./plugins/multiplayer-handler-plugin";
import { TerrainPlugin } from "./plugins/terrain/terrain-plugin";

export const socket = io("ws://localhost:8000", {
    query: {
        username: "username"
    }
});

const game = new Game();

game
    .addPlugin(new MultiplayerHandlerPlugin())
    .addPlugin(new TerrainPlugin())
    .run();

socket.on("connect", () => {
    game.addPlugin(new PlayerPlugin(socket.id!));
});

// game
//     .addSystem(SystemMode.Update, method)
//     .addSystem(SystemMode.Update, method)
//     .addSystem(SystemMode.Update, method)
//     .addPlugin()
//     .addSystem(SystemMode.Update, method);


// import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
// import { io } from "socket.io-client";
// import { Player } from "./entities/player";
// import { KeyboardControl } from "./keyboard-control";

// let connected = false;

// const username = prompt("Username");

// const keyboardControl = new KeyboardControl();

// const players: Map<string, Player> = new Map();

// export const socket = io("ws://localhost:8000", {
//   query: {
//     username
//   }
// });

// const scene = new Scene();
// const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);

// const renderer = new WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// camera.position.z = 10;

// socket.on("newplayer", (message) => {
//   if (message.id === undefined) {
//     return;
//   }

//   const playerId = message.id;
//   const player = new Player(playerId);
//   players.set(playerId, player);
//   scene.add(player);
// });


// const player = new Player("");
// socket.on("walk", (message) => {
//   if (!("id" in message)) {
//     return;
//   }

//   const otherPlayer = players.get(message.id);
//   if (otherPlayer === undefined) {
//     return;
//   }

//   otherPlayer.position.x = message.x;
//   otherPlayer.position.y = message.y;
// });

// socket.on("connect", () => {
//   console.log("connected", socket.id);
//   if (socket.id === undefined) {
//     return;
//   }

//   connected = true;
//   player.playerId = socket.id;
//   socket.on("initial_players", (initialPlayers) => {
//     if (!Array.isArray(initialPlayers)) {
//       return;
//     }
//     for (const [_, initialPlayer] of initialPlayers) {
//       console.log(initialPlayer)
//       const player = new Player(initialPlayer.id);
//       players.set(initialPlayer.id, player);
//       scene.add(player);
//     }
//   });
// });

// socket.on("player_disconnected", (playerId) => {
//   console.log("Player disconnected", playerId);
//   const player = players.get(playerId);
//   if (player === undefined) {
//     return;
//   }

//   scene.remove(player);
//   players.delete(playerId);
// });

// scene.add(player);

// function animate() {
//   if (!connected) {
//     return;
//   }
//   const speed = 0.1;
//   if (keyboardControl.isPressed("KeyW")) {
//     player.moveY(speed)
//   } else if (keyboardControl.isPressed("KeyS")) {
//     player.moveY(-speed);
//   }

//   if (keyboardControl.isPressed("KeyD")) {
//     player.moveX(speed);
//   } else if (keyboardControl.isPressed("KeyA")) {
//     player.moveX(-speed);
//   }
//   renderer.render(scene, camera);
// }

// renderer.setAnimationLoop(animate);

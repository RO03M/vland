import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { io } from "socket.io-client";
import { Player } from "./entities/player";
import { KeyboardControl } from "./keyboard-control";

let connected = false;

const keyboardControl = new KeyboardControl();

const players: Map<string, Player> = new Map();

export const socket = io("ws://localhost:8000");

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 10;

socket.on("newplayer", (message) => {
  if (message.id === undefined) {
    return;
  }

  const playerId = message.id;
  const player = new Player(playerId);
  players.set(playerId, player);
  scene.add(player);
});


const player = new Player("");
socket.on("walk", (message) => {
  console.log(message);
  if (!("id" in message)) {
    return;
  }

  const otherPlayer = players.get(message.id);
  if (otherPlayer === undefined) {
    return;
  }

  otherPlayer.position.x = message.x;
  otherPlayer.position.y = message.y;
});

socket.on("connect", () => {
  console.log("connected", socket.id);
  if (socket.id === undefined) {
    return;
  }

  connected = true;
  player.playerId = socket.id;
});

scene.add(player);

const clock = new Clock();

function animate() {
  if (!connected) {
    return;
  }
  const deltaTime = clock.getDelta();
  const speed = 0.1;
  if (keyboardControl.isPressed("KeyW")) {
    player.moveY(speed)
  } else if (keyboardControl.isPressed("KeyS")) {
    player.moveY(-speed);
  }

  if (keyboardControl.isPressed("KeyD")) {
    player.moveX(speed);
  } else if (keyboardControl.isPressed("KeyA")) {
    player.moveX(-speed);
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

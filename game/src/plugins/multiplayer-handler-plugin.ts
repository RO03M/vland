import { Sprite, SpriteMaterial, TextureLoader } from "three";
import { Game } from "../core/game";
import { Plugin } from "../core/plugin";
import { socket } from "../main";

export class MultiplayerHandlerPlugin extends Plugin {
    public players: Map<string, Sprite> = new Map();

    build(game: Game): void {
        console.log("builded");
        socket.on("newplayer", (message) => {
            if (message.id === undefined) {
                return;
            }

            console.log(message);

            const map = new TextureLoader().load("image.png");
            const material = new SpriteMaterial({ map });
            const playerId = message.id;
            const player = new Sprite(material);
            player.position.set(0, 0, 0);
            this.players.set(playerId, player);
            game.scene.add(player);
        });

        socket.on("walk", (message) => {
          if (!("id" in message)) {
            return;
          }

          const otherPlayer = this.players.get(message.id);
          console.log(otherPlayer, message);
          if (otherPlayer === undefined) {
            return;
          }

          otherPlayer.position.x = message.x;
          otherPlayer.position.y = message.y;
          otherPlayer.position.z = message.z;
        });

        socket.on("player_disconnected", (playerId) => {
            console.log("Player disconnected", playerId);
            const player = this.players.get(playerId);
            if (player === undefined) {
                return;
            }

            game.scene.remove(player);
            this.players.delete(playerId);
        });

        socket.on("initial_players", (initialPlayers) => {
            if (!Array.isArray(initialPlayers)) {
                return;
            }
            for (const [_, initialPlayer] of initialPlayers) {
                console.log(initialPlayer)
                const map = new TextureLoader().load("image.png");
                const material = new SpriteMaterial({ map });
                const player = new Sprite(material);
                this.players.set(initialPlayer.id, player);
                game.scene.add(player);
            }
        });
    }
}
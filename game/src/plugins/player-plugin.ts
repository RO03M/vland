import { Sprite, SpriteMaterial, TextureLoader } from "three";
import { Game, SystemMode } from "../core/game";
import { Plugin } from "../core/plugin";
import { socket } from "../main";

export class PlayerPlugin extends Plugin {
    public sprite: Sprite;
    public playerId: string;

    constructor(id: string) {
        super();
        const map = new TextureLoader().load("image.png");
        const material = new SpriteMaterial({ map });
        this.sprite = new Sprite(material);

        this.playerId = id;
    }

    public emitMove() {
        socket.emit("walk", { id: this.playerId, x: this.sprite.position.x, y: this.sprite.position.y });
    }

    public moveX(value: number) {
        this.sprite.position.x += value;
        this.emitMove();
    }

    public moveY(value: number) {
        this.sprite.position.z -= value;
        this.emitMove();
    }

    build(game: Game): void {
        game.scene.add(this.sprite);
        const speed = 0.1;
        game.addSystem(SystemMode.UPDATE, () => {
            if (Game.keyboardControl.isPressed("KeyW")) {
                this.moveY(speed)
            } else if (Game.keyboardControl.isPressed("KeyS")) {
                this.moveY(-speed);
            }
    
            if (Game.keyboardControl.isPressed("KeyD")) {
                this.moveX(speed);
            } else if (Game.keyboardControl.isPressed("KeyA")) {
                this.moveX(-speed);
            }
        });

        game.addSystem(SystemMode.UPDATE, () => {
            game.camera.position.x = this.sprite.position.x;
            game.camera.position.y = this.sprite.position.y + 5;
            game.camera.position.z = this.sprite.position.z + 10;
        });

        game.addSystem(SystemMode.UPDATE, () => {
            this.sprite.lookAt(game.camera.position);
        });
    }
}
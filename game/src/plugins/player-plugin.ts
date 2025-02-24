import { PointLight, Sprite, SpriteMaterial, TextureLoader } from "three";
import { Game, SystemMode } from "../core/game";
import { Plugin } from "../core/plugin";
import { socket } from "../main";
import { degreesToRadians } from "../core/math-utils";

export class PlayerPlugin extends Plugin {
    public sprite: Sprite;
    public playerId: string;
    public light: PointLight;

    constructor(id: string) {
        super();
        const map = new TextureLoader().load("image.png");
        const material = new SpriteMaterial({ map });
        this.sprite = new Sprite(material);
        this.light = new PointLight(0xffffff, 10, 10000);

        this.playerId = id;
    }

    public emitMove() {
        socket.emit("walk", { id: this.playerId, x: this.sprite.position.x, y: this.sprite.position.y, z: this.sprite.position.z });
    }

    public moveX(value: number) {
        this.sprite.position.x += value;
        this.light.position.x += value;
        this.emitMove();
    }

    public moveY(value: number) {
        this.sprite.position.y += value;
        this.light.position.y += value;
        this.emitMove();
    }

    public moveZ(value: number) {
        this.sprite.position.z -= value;
        this.light.position.z -= value;
        this.emitMove();
    }

    build(game: Game): void {
        game.scene.add(this.sprite);
        game.scene.add(this.light);
        game.camera.rotateX(degreesToRadians(-45));
        const speed = 0.1;
        game.addSystem(SystemMode.UPDATE, () => {
            if (Game.keyboardControl.isPressed("KeyW")) {
                this.moveZ(speed)
            } else if (Game.keyboardControl.isPressed("KeyS")) {
                this.moveZ(-speed);
            }
    
            if (Game.keyboardControl.isPressed("KeyD")) {
                this.moveX(speed);
            } else if (Game.keyboardControl.isPressed("KeyA")) {
                this.moveX(-speed);
            }

            if (Game.keyboardControl.isPressed("Space")) {
                this.moveY(speed);
            } else if (Game.keyboardControl.isPressed("ShiftLeft")) {
                this.moveY(-speed);
            }
        });

        game.addSystem(SystemMode.UPDATE, () => {
            game.camera.position.x = this.sprite.position.x;
            game.camera.position.y = this.sprite.position.y + 3;
            game.camera.position.z = this.sprite.position.z + 3;
        });

        game.addSystem(SystemMode.UPDATE, () => {
            this.sprite.lookAt(game.camera.position);
        });
    }
}
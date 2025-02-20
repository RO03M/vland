import { Sprite, SpriteMaterial, TextureLoader } from "three";
import { Game } from "../core/game";
import { Entity, UpdateMethodOptions } from "../core/entity";
import { socket } from "../main";

/**
 * @deprecated
 */
export class Player implements Entity {
    public sprite: Sprite
    public playerId: string;

    constructor(id: string) {
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
        this.sprite.position.y += value;
        this.emitMove();
    }

    public start({ scene }: UpdateMethodOptions) {
        console.log(scene);
        scene.add(this.sprite);
    }

    public update({ keyboardControl }: UpdateMethodOptions) {
        // if (!this.connected) {
        //     return;
        // }
        console.log("teste");
        const speed = 0.1;
        if (keyboardControl.isPressed("KeyW")) {
            this.moveY(speed)
        } else if (keyboardControl.isPressed("KeyS")) {
            this.moveY(-speed);
        }

        if (keyboardControl.isPressed("KeyD")) {
            this.moveX(speed);
        } else if (keyboardControl.isPressed("KeyA")) {
            this.moveX(-speed);
        }
    }
}
import { Sprite, SpriteMaterial, TextureLoader } from "three";
import { socket } from "../main";

export class Player extends Sprite {
    private readonly speed = 0.1;
    public playerId: string;

    constructor(id: string) {
        const map = new TextureLoader().load("image.png");
        const material = new SpriteMaterial({ map });
        super(material);

        this.playerId = id;
    }

    public emitMove() {
        socket.emit("walk", { id: this.playerId, x: this.position.x, y: this.position.y });
    }

    public moveX(value: number) {
        this.position.x += value;
        this.emitMove();
    }

    public moveY(value: number) {
        this.position.y += value;
        this.emitMove();
    }
}
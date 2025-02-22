import { Game } from "../../core/game";
import { degreesToRadians } from "../../core/math-utils";
import { Plugin } from "../../core/plugin";
import { Block } from "../../world/block";

export class TerrainPlugin extends Plugin {
    build(game: Game): void {
        game.camera.rotateX(degreesToRadians(-45));
        game.camera.position.setY(5)
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    const block = new Block({ x, y, z, top: true, bottom: true, right: true, left: true, back: true, front: true });
                    game.scene.add(block.getMesh());
                }
            }
        }
    }
}
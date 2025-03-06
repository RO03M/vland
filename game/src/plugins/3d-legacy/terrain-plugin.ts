import { AmbientLight } from "three";
import { Game } from "../../core/game";
import { degreesToRadians } from "../../core/math-utils";
import { Plugin } from "../../core/plugin";
import { Block } from "../../world/block";
import { Chunk } from "./chunk";

export class TerrainPlugin extends Plugin {
    build(game: Game): void {
        game.scene.add(new AmbientLight());
        game
            .addPlugin(new Chunk());
        // const ambientLight = new AmbientLight(0xff0000, 1);
        // game.scene.add(ambientLight);
        // for (let x = 0; x < 1; x++) {
        //     for (let y = 0; y < 1; y++) {
        //         for (let z = 0; z < 1; z++) {
        //             const block = new Block({ x, y, z, top: true, bottom: true, right: true, left: true, back: true, front: true });
        //             game.scene.add(block.getMesh());
        //         }
        //     }
        // }
    }
}
import { AmbientLight } from "three";
import { Game } from "../../core/game";
import { Plugin } from "../../core/plugin";
import { Chunk } from "./chunk";

export class TerrainPlugin extends Plugin {
    public build(game: Game): void {
        game.scene.add(new AmbientLight());
        game
            .addPlugin(new Chunk());
    }
}
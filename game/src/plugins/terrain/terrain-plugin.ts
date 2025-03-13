import { AmbientLight, Vector3 } from "three";
import { Game, SystemMode } from "../../core/game";
import { Plugin } from "../../core/plugin";
import { Chunk, CHUNK_SIZE, ChunkMap } from "./chunk";
import { BlockType } from "./blocks/block-type";
import { socket } from "../../main";

export class TerrainPlugin extends Plugin {
    public chunks: Map<number, Map<number, Chunk>> = new Map();
    // public chunks: ChunkMap[][] = [];
    public renderDistance = 4;

    private playerWorldPosition: Vector3 | undefined;

    public build(game: Game): void {
        game.scene.add(new AmbientLight());
        
        game.addSystem(SystemMode.UPDATE, () => {
            const player = game.scene.getObjectByName("main-player");
            if (player === undefined) {
                return
            }

            this.playerWorldPosition = player.position.clone();
        });

        game.addSystem(SystemMode.UPDATE, () => {
            // console.log(this.chunks);
            if (this.playerWorldPosition === undefined) {
                return;
            }
            const chunkPosition = this.worldPositionToChunkPosition(this.playerWorldPosition);
            
            const currentChunk = this.chunks.get(chunkPosition.x)?.get(chunkPosition.y);
            // const currentChunk = this.chunks[chunkPosition.x]?.[chunkPosition.y];
            if (currentChunk === undefined) {
                this.requestChunks(chunkPosition, game);
            }
        });
        
        socket.on("chunk_map", (message) => {
            const position = this.worldPositionToChunkPosition(this.playerWorldPosition!);// deve vir direto do servidor
            const chunk = new Chunk(position, message);

            // if (!this.chunks.has(position.x)) {
            // }
            
            
            
            const foo = this.chunks.get(position.x);
            
            if (foo === undefined) {
                this.chunks.set(position.x, new Map());
            }

            foo?.set(position.y, chunk);
            game.scene.add(chunk.mesh!);
        });
    }

    private requestChunks(position: Vector3, game: Game) {
        if (this.playerWorldPosition === undefined) {
            return
        }
        socket.emit("generate_chunk", this.worldPositionToChunkPosition(this.playerWorldPosition));

        // const chunk = new Chunk(position, this.generateChunkMap());

        // // if (!this.chunks.has(position.x)) {
        // // }
        
        
        
        // const foo = this.chunks.get(position.x);
        
        // if (foo === undefined) {
        //     this.chunks.set(position.x, new Map());
        // }

        // foo?.set(position.y, chunk);
        // game.scene.add(chunk.mesh!);
    }

    private generateChunkMap() {
        const chunkMap: ChunkMap = [];

        for (let x = 0; x < 8; x++) {
            chunkMap[x] = [];
            for (let y = 0; y < 8; y++) {
                chunkMap[x][y] = Math.round(Math.random() * 2);
            }
        }

        return chunkMap;
    }

    private worldPositionToChunkPosition(worldPosition: Vector3) {
        return new Vector3(
            Math.floor(worldPosition.x / CHUNK_SIZE),
            Math.floor(worldPosition.y / CHUNK_SIZE),
            0
        );
    }
}
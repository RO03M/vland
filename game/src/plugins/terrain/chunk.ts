import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import { Game } from "../../core/game";
import { Plugin } from "../../core/plugin";
import { voxelData } from "./voxel-data";

const CHUNK_WIDTH = 5;
const CHUNK_HEIGHT = 10;

export class Chunk extends Plugin {
    public vertexIndex = 0;
    public vertices: number[] = [];
    public triangles: number[] = [];
    public uvs: number[] = [];
    public geometry = new BufferGeometry();

    build(game: Game): void {
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_HEIGHT; y++) {
                for (let z = 0; z < CHUNK_WIDTH; z++) {
                    this.populateChunkData(new Vector3(x, y, z));
                }
            }
        }
        
        game.scene.add(this.getMesh());
    }

    public populateChunkData(position: Vector3) {
        for (let p = 0; p < 6; p++) {
            for (let i = 0; i < 6; i++) {
                const triangleIndex = voxelData.triangles[p][i];
                const [verticeX, verticeY, verticeZ] = voxelData.vertices[triangleIndex];
                console.log(verticeX, verticeY, verticeZ);
                this.vertices.push(
                    verticeX + position.x,
                    verticeY + position.y,
                    verticeZ + position.z
                );
                this.triangles.push(this.vertexIndex);
                this.uvs.push(...voxelData.uvs[i]);

                this.vertexIndex++;
            }
        }
    }

    public getMesh() {
        this.geometry.setAttribute("position", new BufferAttribute(new Uint16Array(this.vertices), 3));
        this.geometry.setAttribute("uv", new BufferAttribute(new Uint16Array(this.uvs), 2));
        this.geometry.setIndex(new BufferAttribute(new Uint16Array(this.triangles), 1));

        this.geometry.computeVertexNormals();

        const loader = new TextureLoader();
        const texture = loader.load("textures/grass.png");

        const material = new MeshStandardMaterial({ wireframe: false, color: 0xffffff, blendAlpha: 1, map: texture });

        return new Mesh(this.geometry, material);
    }
}
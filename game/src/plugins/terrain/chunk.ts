import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import { Game } from "../../core/game";
import { Plugin } from "../../core/plugin";
import { voxelData } from "./voxel-data";

const CHUNK_WIDTH = 2;
const CHUNK_HEIGHT = 20;

export class Chunk extends Plugin {
    public vertexIndex = 0;
    public vertices: Vector3[] = [];
    public triangles: number[] = [];
    public uvs: number[] = [];
    public geometry = new BufferGeometry();

    public voxelMap: boolean[][][] = [];

    build(game: Game): void {
        // this.createChunkMap();

        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_HEIGHT; y++) {
                for (let z = 0; z < CHUNK_WIDTH; z++) {
                    this.populateChunkData(new Vector3(x, y, z));
                }
            }
        }
        
        game.scene.add(this.getMesh());
    }

    public shouldRenderFace() {

    }

    public createChunkMap() {
        for (let x = 0; x < CHUNK_WIDTH; x++) {
            for (let y = 0; y < CHUNK_HEIGHT; y++) {
                for (let z = 0; z < CHUNK_WIDTH; z++) {
                    this.voxelMap[x][y][z] = true;
                }
            }
        }
    }

    public populateChunkData(position: Vector3) {
        for (let p = 0; p < 6; p++) {
            if (this.faceCheck(position.clone().add(voxelData.faceChecks[p]))) {
                this.vertices.push(position.clone().add(voxelData.vertices[voxelData.triangles[p][0]]));
                this.vertices.push(position.clone().add(voxelData.vertices[voxelData.triangles[p][1]]));
                this.vertices.push(position.clone().add(voxelData.vertices[voxelData.triangles[p][2]]));
                this.vertices.push(position.clone().add(voxelData.vertices[voxelData.triangles[p][3]]));
                this.uvs.push(...voxelData.uvs[0]);
                this.uvs.push(...voxelData.uvs[1]);
                this.uvs.push(...voxelData.uvs[2]);
                this.uvs.push(...voxelData.uvs[3]);
                this.triangles.push(this.vertexIndex);
                this.triangles.push(this.vertexIndex + 1);
                this.triangles.push(this.vertexIndex + 2);
                this.triangles.push(this.vertexIndex + 2);
                this.triangles.push(this.vertexIndex + 1);
                this.triangles.push(this.vertexIndex + 3);
                this.vertexIndex += 4;
                
                // for (let i = 0; i < 6; i++) {
                //     const triangleIndex = voxelData.triangles[p][i];
                //     const clone = position.clone();
                //     this.vertices.push(clone.add(voxelData.vertices[triangleIndex]));
    
                //     this.triangles.push(this.vertexIndex);
                //     this.uvs.push(...voxelData.uvs[i]);
    
                //     this.vertexIndex++;
                // }
            }
        }
    }

    public faceCheck(position: Vector3) {
        const [x, y, z] = position;
        if (x < 0 || x > CHUNK_WIDTH - 1 || y < 0 || y > CHUNK_HEIGHT - 1 || z < 0 || z > CHUNK_WIDTH - 1) {
            return false;
        }

        return true;
    }

    public getMesh() {
        const flattenVertices = this.vertices.map((v) => v.toArray()).flat();
        this.geometry.setAttribute("position", new BufferAttribute(new Uint16Array(flattenVertices), 3));
        this.geometry.setAttribute("uv", new BufferAttribute(new Uint16Array(this.uvs), 2));
        this.geometry.setIndex(new BufferAttribute(new Uint16Array(this.triangles), 1));

        this.geometry.computeVertexNormals();

        const loader = new TextureLoader();
        const texture = loader.load("textures/grasstop.png");

        const material = new MeshStandardMaterial({ wireframe: false, color: 0xffffff, blendAlpha: 1, map: texture });

        return new Mesh(this.geometry, material);
    }
}
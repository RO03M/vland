import { BufferAttribute, BufferGeometry, Float16BufferAttribute, Mesh, MeshStandardMaterial, NearestFilter, Texture, TextureLoader, Vector3 } from "three";
import { Game } from "../../core/game";
import { Plugin } from "../../core/plugin";
import { BlockType } from "./blocks/block-type";
import { getUvCoordsFromBlockType } from "./blocks/get-uv-coords-from-block-type";

const BLOCKS_TILEMAP_SIZE = 256;
const GRID_SIZE = 8;
const BLOCK_TILEMAP_GRID_COUNT = BLOCKS_TILEMAP_SIZE / GRID_SIZE;

const CHUNK_SIZE = 8;

export class Chunk extends Plugin {
    public uvs: number[] = [];
    public triangles: number[] = [];
    public vertices: Vector3 [] = [];
    
    private vertexIndex = 0;
    private tilemap: Texture;

    constructor() {
        super();
        const loader = new TextureLoader();
        this.tilemap = loader.load("textures/blocks/blocks.png");
        this.tilemap.minFilter = NearestFilter;
        this.tilemap.magFilter = NearestFilter;
    }

    public uvFromCoords(x: number, y: number) {
        return [
            (x - 1) / BLOCK_TILEMAP_GRID_COUNT, (y - 1) / BLOCK_TILEMAP_GRID_COUNT,
            (x - 1) / BLOCK_TILEMAP_GRID_COUNT, y / BLOCK_TILEMAP_GRID_COUNT,
            x / BLOCK_TILEMAP_GRID_COUNT, y / BLOCK_TILEMAP_GRID_COUNT,
            x / BLOCK_TILEMAP_GRID_COUNT, (y - 1) / BLOCK_TILEMAP_GRID_COUNT,
        ];
    }

    public build(game: Game): void {
        const geometry = new BufferGeometry();

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                const blockData = this.buildBlockData(new Vector3(x, y, 0), Math.round(Math.random() * 2));
                this.triangles.push(...blockData.triangles);
                this.vertices.push(...blockData.vertices);
                this.uvs.push(...blockData.uvs);
            }
        }

        const flattenVertices = this.vertices.map((v) => v.toArray()).flat();
        geometry.setAttribute("position", new BufferAttribute(new Uint16Array(flattenVertices), 3));
        geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.uvs), 2));
        geometry.setIndex(new BufferAttribute(new Uint16Array(this.triangles), 1));

        geometry.computeVertexNormals();

        const material = new MeshStandardMaterial({ wireframe: false, color: 0xffffff, blendAlpha: 1, map: this.tilemap });
        
        const mesh = new Mesh(geometry, material);
        
        mesh.name = "foda";
        game.scene.add(mesh);
    }

    public buildBlockData(position: Vector3, blockType: BlockType) {
        const vertices: Vector3[] = [];
        const uvs: number[] = [];
        const triangles: number[] = [];

        vertices.push(new Vector3(0, 0, 0).add(position));
        vertices.push(new Vector3(0, 1, 0).add(position));
        vertices.push(new Vector3(1, 1, 0).add(position));
        vertices.push(new Vector3(1, 0, 0).add(position));

        uvs.push(...this.uvFromCoords(...getUvCoordsFromBlockType(blockType, {
            isLeveled: true
        })));

        triangles.push(
            this.vertexIndex,
            this.vertexIndex + 3,
            this.vertexIndex + 1
        );
        triangles.push(
            this.vertexIndex + 2,
            this.vertexIndex + 1,
            this.vertexIndex + 3
        );

        this.vertexIndex += 4;

        return {
            triangles,
            vertices,
            uvs
        };
    }
}
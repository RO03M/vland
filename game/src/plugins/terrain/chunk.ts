import { BufferAttribute, BufferGeometry, Float16BufferAttribute, Mesh, MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import { Game } from "../../core/game";
import { Plugin } from "../../core/plugin";

export class Chunk extends Plugin {
    public uvs: number[] = [];
    public triangles: number[] = [];
    public vertices: Vector3 [] = [];

    public uvCoords(row: number, col: number, gridSize: number) {
        const uvGridSize = 1 / gridSize;

        const uvX = uvGridSize * row;
        const uvY = uvGridSize * col;

        return [
            uvX, uvY - 1,
            uvX, uvY,
            uvX - 1, uvY - 1,
            uvX - 1, uvY
        ];
    }

    public build(game: Game): void {
        const geometry = new BufferGeometry();

        let tileX = 0; // Column index (starting from 0)
        let tileY = 0; // Row index (starting from 0)
        let tileWidth = 1 / 8;
        let tileHeight = 1 / 8;

        let uMin = tileX * tileWidth;
        let vMin = 1 - (tileY + 1) * tileHeight;
        let uMax = (tileX + 1) * tileWidth;
        let vMax = 1 - tileY * tileHeight;

        this.vertices.push(new Vector3(0, 0, 0));//2 bottom left
        this.vertices.push(new Vector3(0, 1, 0));//3 top left
        this.vertices.push(new Vector3(1, 1, 0));//1 top right
        this.vertices.push(new Vector3(1, 0, 0));//0 bottom right

        // this.uvs.push(1, 0, 1, 1, 0, 0, 0, 1);
        // this.uvs.push(
        //     1 / 8, 0,
        //     1 / 8, 1 / 8,
        //     0, 0,
        //     0, 1 / 8
        // );
        // this.uvs.push(
        //     0, 0,
        //     0, 1,
        //     1, 1,
        //     1, 0,
        // );
        // row = 7
        // col = 0
        const x = 1;
        const y = 8;
        this.uvs.push(
            (x - 1) / 8, (y - 1) / 8,
            (x - 1) / 8, y / 8,
            x / 8, y / 8,
            x / 8, (y - 1) / 8,
        );

        // console.log([
        //     1 / 8, 0,
        //     1 / 8, 1 / 8,
        //     0, 0,
        //     0, 1 / 8
        // ])
        // this.uvs.push(...this.uvCoords(1, 1, 8));
        console.log(this.uvs);


        this.triangles.push(0, 3, 1);
        this.triangles.push(2, 1, 3);
        // this.triangles.push(2, 1, 3);
        // this.triangles.push(2, 1, 3);
        // this.triangles.push(1, 2, 0);

        const flattenVertices = this.vertices.map((v) => v.toArray()).flat();
        geometry.setAttribute("position", new BufferAttribute(new Uint16Array(flattenVertices), 3));
        geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.uvs), 2));
        geometry.setIndex(new BufferAttribute(new Uint16Array(this.triangles), 1));

        geometry.computeVertexNormals();

        const loader = new TextureLoader();
        const texture = loader.load("uv.jpeg");
        
        const material = new MeshStandardMaterial({ wireframe: false, color: 0xffffff, blendAlpha: 1, map: texture });
        
        const mesh = new Mesh(geometry, material);
        setTimeout(() => console.log(texture.source.data.width, texture.source.data.height), 2000);
        mesh.name = "foda";
        game.scene.add(mesh);
    }

    public foo() {

    }
}
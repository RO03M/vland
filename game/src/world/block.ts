import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, TextureLoader } from "three";

// Define vertices (x, y, z) for a simple triangle
const vertices = new Float32Array([
    // Front face
    0, 0,  1,  // 0
     1, 0,  1,  // 1
     1,  1,  1,  // 2
    0,  1,  1,  // 3

    // Back face
    0, 0, 0,  // 4
     1, 0, 0,  // 5
     1,  1, 0,  // 6
    0,  1, 0   // 7
]);

const topFaceIndices = [3, 2, 6,  3, 6, 7];
const rightFaceIndices = [1, 5, 6,  1, 6, 2];
const frontFaceIndices = [0, 1, 2,  0, 2, 3];
const leftFaceIndices = [4, 3, 7, 4, 0, 3];
const backFaceIndices = [5, 4, 7,  5, 7, 6];
const bottomFaceIndices = [4, 5, 1,  4, 1, 0];

const faceIndices = [
    topFaceIndices,
    rightFaceIndices,
    frontFaceIndices,
    leftFaceIndices,
    backFaceIndices,
    bottomFaceIndices
];

const uvMap = [
    [0, 0],
    [0, 0.5],
    [1, 0],
    [1, 0],
    [1, 1],
    [0, 1]
];

type BlockOptions = {
    x: number;
    y: number;
    z: number;
    front?: boolean;
    right?: boolean;
    back?: boolean;
    left?: boolean;
    top?: boolean;
    bottom?: boolean;
}

export class Block {
    private mesh: Mesh;

    constructor(options: BlockOptions) {
        const faces = [
            options.top,
            options.right,
            options.front,
            options.left,
            options.back,
            options.bottom
        ];

        const geometry = new BufferGeometry();
        const indices: number[] = [];
        const uvs: number[] = [];

        for (let i = 0, materialIndex = 0; i < 6; i++) {
            if (!faces[i]) {
                continue;
            }

            geometry.addGroup(indices.length, 6, materialIndex);
            for (let a = 0; a < 6; a++) {
                indices.push(faceIndices[i][a]);
                uvs.push(...uvMap[a]);
            }

            // const offset = indices.
            // indices.push(...faceIndices[i]);
            materialIndex++;
        }
        
        geometry.setAttribute("position", new BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        geometry.setIndex(new BufferAttribute(new Uint8Array(indices), 1));
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
        console.log(geometry, uvs);

        const loader = new TextureLoader();
        const materials = [
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg", () => console.log("loaded")) }),  // Top
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg") }),   // Right
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg") }),    // Front
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg") }), // Left
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg") }),   // Back
            new MeshBasicMaterial({ wireframe: false, color: 0xffffff, map: loader.load("uv.jpeg") })   // Bottom
        ];
        this.mesh = new Mesh(geometry, materials);
        this.mesh.position.set(options.x, options.y, options.z);
    }

    public getMesh() {
        return this.mesh;
    }
}
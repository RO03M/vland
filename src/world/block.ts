import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, NormalBufferAttributes } from "three";

// Define vertices (x, y, z) for a simple triangle
const vertices = new Float32Array([
    // Front face
    -1, -1,  1,  // 0
     1, -1,  1,  // 1
     1,  1,  1,  // 2
    -1,  1,  1,  // 3

    // Back face
    -1, -1, -1,  // 4
     1, -1, -1,  // 5
     1,  1, -1,  // 6
    -1,  1, -1   // 7
]);

const topFaceIndices = [3, 2, 6,  3, 6, 7];
const rightFaceIndices = [1, 5, 6,  1, 6, 2];
const frontFaceIndices = [0, 1, 2,  0, 2, 3];
const leftFaceIndices = [4, 0, 3,  4, 3, 7];
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

// Define indices (optional if using indexed geometry)
const indices = new Uint16Array([
    // Front face
    0, 1, 2,  0, 2, 3,

    // Right face
    1, 5, 6,  1, 6, 2,

    // Back face
    5, 4, 7,  5, 7, 6,

    // Left face
    4, 0, 3,  4, 3, 7,

    // Top face
    3, 2, 6,  3, 6, 7,

    // Bottom face
    4, 5, 1,  4, 1, 0
]);
console.log(indices);

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

        for (let i = 0; i < 6; i++) {
            if (!faces[i]) {
                continue;
            }

            indices.push(
                faceIndices[i][0],
                faceIndices[i][1],
                faceIndices[i][2],
                faceIndices[i][3],
                faceIndices[i][4],
                faceIndices[i][5]
            );
        }
        console.log(indices);
        geometry.setAttribute("position", new BufferAttribute(vertices, 3));
        geometry.setIndex(new BufferAttribute(new Uint8Array(indices), 1));

        const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });

        this.mesh = new Mesh(geometry, material);
        this.mesh.position.x = options.x;
        this.mesh.position.y = options.y;
        this.mesh.position.z = options.z;
    }

    public getMesh() {
        return this.mesh;
    }
}
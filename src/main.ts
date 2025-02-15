import { BoxGeometry, BufferAttribute, BufferGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new BoxGeometry(1, 2, 1);
// const material = new MeshBasicMaterial({ color: 0x00ff55, wireframe: true });

// const cube = new Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const geometry = new BufferGeometry();

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

// Define indices (optional if using indexed geometry)
const indices = new Uint16Array([
    // Front face
    0, 1, 2,  0, 2, 3,

    // Right face
    1, 5, 6,  1, 6, 2,

    // Back face
    5, 4, 7,  5, 7, 6,

    // Left face
    // 4, 0, 3,  4, 3, 7,

    // Top face
    3, 2, 6,  3, 6, 7,

    // Bottom face
    4, 5, 1,  4, 1, 0
]);

// Set attributes
geometry.setAttribute('position', new BufferAttribute(vertices, 3));
geometry.setIndex(new BufferAttribute(indices, 1));

// Create material
const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: false });

// Create mesh
const cube = new Mesh(geometry, material);
scene.add(cube);


const clock = new Clock();

function animate() {
  const deltaTime = clock.getDelta();
  // cube.rotation.x += deltaTime;
  cube.rotation.y += deltaTime;
  // cube.rotation.z += deltaTime;
  renderer.render(scene, camera);
  console.log(clock.getElapsedTime());
}

renderer.setAnimationLoop(animate);

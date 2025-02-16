import { BoxGeometry, BufferAttribute, BufferGeometry, Clock, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { Block } from "./world/block";

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 10;

for (let x = -3; x < 3; x++) {
  for (let y = -3; y < 3; y++) {
    for (let z = -3; z < 3; z++) {
      const block = new Block({ x, y, z, top: true, bottom: true, right: true, left: true, back: true, front: true });
      scene.add(block.getMesh());
    }
  }
}

const clock = new Clock();

function animate() {
  const deltaTime = clock.getDelta();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

document.addEventListener("keydown", (event) => {
  const key = event.code;
  console.log(key);
  const speed = clock.getDelta() * 50;

  switch(key) {
    case "KeyW":
      camera.position.z -= speed;
      break;
    case "KeyS":
      camera.position.z += speed;
      break;
    case "KeyA":
      camera.position.x -= speed;
      break;
    case "KeyD":
      camera.position.x += speed;
      break;
    case "Space":
      camera.position.y += speed;
      break;
    case "KeyZ":
      camera.position.y -= speed;
      break;
  }
});

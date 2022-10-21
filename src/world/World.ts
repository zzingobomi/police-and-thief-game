import * as THREE from "three";
import * as CANNON from "cannon-es";
import {
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  Object3D,
} from "three";
import { createCanvas } from "canvas";

// TODO: node server 에서는 확실히 three 이용 불가..?
// TODO: cannon.js 와는 통합되지 않을까..?
export class World {
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;
  public scene: Scene;

  public physicsWorld: CANNON.World;

  private previousTime = 0;

  constructor() {
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initPhysics();

    requestAnimationFrame(this.render.bind(this));
  }

  private initRenderer() {
    const canvas = createCanvas(200, 200);
    // TODO: THREE.WebGLRenderer: _canvas.addEventListener is not a function
    // @ts-ignore
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setPixelRatio(2);
    this.renderer = renderer;
  }

  private initScene() {
    const scene = new THREE.Scene();
    this.scene = scene;
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(80, 1920 / 1080, 0.1, 1010);

    this.camera.position.set(0, 20, 0);
  }

  private initPhysics() {
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -9.81, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.allowSleep = true;
  }

  private update(delta: number) {
    console.log("update", delta);
  }

  private render(time: number) {
    time *= 0.001; // second unit

    const deltaTime = time - this.previousTime;

    // Logic
    this.update(deltaTime);

    // Rendering
    this.renderer.render(this.scene, this.camera);
    this.previousTime = time;

    requestAnimationFrame(this.render.bind(this));
  }
}

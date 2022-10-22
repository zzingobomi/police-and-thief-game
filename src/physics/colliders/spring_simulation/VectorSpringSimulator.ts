import { SimulationFrame } from "./SimulationFrame";
import { SimulatorBase } from "./SimulatorBase";
import * as THREE from "three";
import * as Utils from "../../../utils/FunctionLibrary";
import { SimulationFrameVector } from "./SimulationFrameVector";

export class VectorSpringSimulator extends SimulatorBase {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public target: THREE.Vector3;
  public cache: SimulationFrameVector[];

  constructor(fps: number, mass: number, damping: number) {
    super(fps, mass, damping);

    this.init();
  }

  public init() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.target = new THREE.Vector3();

    this.cache = [];
    for (let i = 0; i < 2; i++) {
      this.cache.push(
        new SimulationFrameVector(new THREE.Vector3(), new THREE.Vector3())
      );
    }
  }

  public simulate(delta: number) {
    this.generateFrames(delta);

    this.position.lerpVectors(
      this.cache[0].position,
      this.cache[1].position,
      this.offset / this.frameTime
    );
    this.velocity.lerpVectors(
      this.cache[0].velocity,
      this.cache[1].velocity,
      this.offset / this.frameTime
    );
  }

  public getFrame(isLastFrame: boolean): SimulationFrameVector {
    const newSpring = new SimulationFrameVector(
      this.lastFrame().position.clone(),
      this.lastFrame().velocity.clone()
    );

    Utils.springV(
      newSpring.position,
      this.target,
      newSpring.velocity,
      this.mass,
      this.damping
    );

    return newSpring;
  }
}

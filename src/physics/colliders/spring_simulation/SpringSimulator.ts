import { SimulationFrame } from "./SimulationFrame";
import { SimulatorBase } from "./SimulatorBase";
import * as THREE from "three";
import * as Utils from "../../../utils/FunctionLibrary";

export class SpringSimulator extends SimulatorBase {
  public position: number;
  public velocity: number;
  public target: number;
  public cache: SimulationFrame[];

  constructor(
    fps: number,
    mass: number,
    damping: number,
    startPosition = 0,
    startVelocity = 0
  ) {
    super(fps, mass, damping);

    this.position = startPosition;
    this.velocity = startVelocity;

    this.target = 0;

    this.cache = [];
    for (let i = 0; i < 2; i++) {
      this.cache.push(new SimulationFrame(startPosition, startVelocity));
    }
  }

  public simulate(delta: number) {
    this.generateFrames(delta);

    this.position = THREE.MathUtils.lerp(
      this.cache[0].position,
      this.cache[1].position,
      this.offset / this.frameTime
    );
    this.velocity = THREE.MathUtils.lerp(
      this.cache[0].velocity,
      this.cache[1].velocity,
      this.offset / this.frameTime
    );
  }

  public getFrame(isLastFrame: boolean): SimulationFrame {
    return Utils.spring(
      this.lastFrame().position,
      this.target,
      this.lastFrame().velocity,
      this.mass,
      this.damping
    );
  }
}

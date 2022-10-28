import { GLTF } from "three-stdlib";
import { KeyBinding } from "../core/KeyBinding";
import { EntityType } from "../enums/EntityType";
import { IControllable } from "../interfaces/IControllable";
import { Vehicle } from "./Vehicle";

export class Car extends Vehicle implements IControllable {
  public entityType: EntityType = EntityType.Car;

  actions: { [action: string]: KeyBinding };

  constructor(gltf: GLTF) {
    super(gltf, {
      radius: 0.25,
      suspensionStiffness: 20,
      suspensionRestLength: 0.35,
      maxSuspensionTravel: 1,
      frictionSlip: 0.8,
      dampingRelaxation: 2,
      dampingCompression: 2,
      rollInfluence: 0.8,
    });
  }

  public update(timeStep: number): void {
    super.update(timeStep);
  }
}

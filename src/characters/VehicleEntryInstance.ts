import { VehicleSeat } from "../vehicles/VehicleSeat";
import { Character } from "./Character";
import * as THREE from "three";

export class VehicleEntryInstance {
  public character: Character;
  public targetSeat: VehicleSeat;
  public entryPoint: THREE.Object3D;
  public wantsToDrive: boolean = false;

  constructor(character: Character) {
    this.character = character;
  }

  public update(timeStep: number) {
    let entryPointWorldPos = new THREE.Vector3();
    this.entryPoint.getWorldPosition(entryPointWorldPos);
    let viewVector = new THREE.Vector3().subVectors(
      entryPointWorldPos,
      this.character.position
    );
    this.character.setOrientation(viewVector);

    const heightDifference = viewVector.y;
    viewVector.y = 0;

    if (
      this.character.charState.canEnterVehicles &&
      viewVector.length() < 0.2 &&
      heightDifference < 2
    ) {
      this.character.enterVehicle(this.targetSeat, this.entryPoint);
    }
  }
}

import * as THREE from "three";
import { StateType } from "../../../enums/StateType";
import { SpringSimulator } from "../../../physics/colliders/spring_simulation/SpringSimulator";
import { VehicleSeat } from "../../../vehicles/VehicleSeat";
import { Character } from "../../Character";
import { CharacterStateBase } from "../CharacterStateBase";
import * as Utils from "../../../utils/FunctionLibrary";
import { Side } from "../../../enums/Side";

export class OpenVehicleDoor extends CharacterStateBase {
  private seat: VehicleSeat;
  private entryPoint: THREE.Object3D;
  private hasOpenedDoor: boolean = false;

  private startPosition: THREE.Vector3 = new THREE.Vector3();
  private endPosition: THREE.Vector3 = new THREE.Vector3();
  private startRotation: THREE.Quaternion = new THREE.Quaternion();
  private endRotation: THREE.Quaternion = new THREE.Quaternion();

  private factorSimulator: SpringSimulator;

  constructor(
    character: Character,
    seat: VehicleSeat,
    entryPoint: THREE.Object3D
  ) {
    super(character, StateType.OpenVehicleDoor);

    this.canFindVehiclesToEnter = false;
    this.seat = seat;
    this.entryPoint = entryPoint;

    const side = Utils.detectRelativeSide(entryPoint, seat.seatPointObject);
    if (side === Side.Left) {
      this.animationName = "open_door_standing_left";
    } else if (side === Side.Right) {
      this.animationName = "open_door_standing_right";
    }
    this.playAnimation(this.animationName);

    this.character.resetVelocity();
    this.character.rotateModel();
    this.character.setPhysicsEnabled(false);

    // 캐릭터가 순간적으로 바닥에 떨어지지 않게 하기 위해?
    (this.seat.vehicle as unknown as THREE.Object3D).attach(this.character);

    this.startPosition.copy(this.character.position);
    this.endPosition.copy(this.entryPoint.position);
    this.endPosition.y += 0.53;

    this.startRotation.copy(this.character.quaternion);
    this.endRotation.copy(this.entryPoint.quaternion);

    this.factorSimulator = new SpringSimulator(60, 10, 0.5);
    this.factorSimulator.target = 1;
  }

  public update(timeStep: number) {
    super.update(timeStep);

    if (this.timer > 0.3 && !this.hasOpenedDoor) {
      this.hasOpenedDoor = true;
      this.seat.door?.open();
    }

    if (this.animationEnded(timeStep)) {
      if (this.anyDirection()) {
        this.character.vehicleEntryInstance = null;
        this.character.world.scene.attach(this.character);
        this.character.setPhysicsEnabled(true);
        this.character.setState(
          Utils.characterStateFactory(StateType.Idle, this.character)
        );
      } else {
        this.character.setState(
          Utils.characterStateFactory(
            StateType.EnteringVehicle,
            this.character,
            this.seat,
            this.entryPoint
          )
        );
      }
    } else {
      this.factorSimulator.simulate(timeStep);

      const lerpPosition = new THREE.Vector3().lerpVectors(
        this.startPosition,
        this.endPosition,
        this.factorSimulator.position
      );
      this.character.setPosition(
        lerpPosition.x,
        lerpPosition.y,
        lerpPosition.z
      );

      this.character.quaternion.slerpQuaternions(
        this.startRotation,
        this.endRotation,
        this.factorSimulator.position
      );
    }
  }
}

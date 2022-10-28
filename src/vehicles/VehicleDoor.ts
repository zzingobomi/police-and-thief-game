import * as THREE from "three";
import { Vehicle } from "./Vehicle";
import { VehicleSeat } from "./VehicleSeat";
import * as Utils from "../utils/FunctionLibrary";
import { Side } from "../enums/Side";

export class VehicleDoor {
  public vehicle: Vehicle;
  public seat: VehicleSeat;
  public doorObject: THREE.Object3D;
  public doorWorldPos: THREE.Vector3 = new THREE.Vector3();
  public lastTrailerPos: THREE.Vector3 = new THREE.Vector3();
  public lastTrailerVel: THREE.Vector3 = new THREE.Vector3();

  public rotation: number = 0;
  public achievingTargetRotation: boolean = false;
  public physicsEnabled: boolean = false;
  public targetRotation: number = 0;
  public rotationSpeed: number = 5;

  private sideMultiplier: number;

  constructor(seat: VehicleSeat, object: THREE.Object3D) {
    this.seat = seat;
    this.vehicle = seat.vehicle as unknown as Vehicle;
    this.doorObject = object;

    const side = Utils.detectRelativeSide(
      this.seat.seatPointObject,
      this.doorObject
    );
    if (side === Side.Left) this.sideMultiplier = -1;
    else if (side === Side.Right) this.sideMultiplier = 1;
    else this.sideMultiplier = 0;
  }

  public update(timestep: number) {
    if (this.achievingTargetRotation) {
      if (this.rotation < this.targetRotation) {
        this.rotation += timestep * this.rotationSpeed;

        if (this.rotation > this.targetRotation) {
          this.rotation = this.targetRotation;
          this.achievingTargetRotation = false;
          this.physicsEnabled = true;
        }
      } else if (this.rotation > this.targetRotation) {
        this.rotation -= timestep * this.rotationSpeed;

        if (this.rotation < this.targetRotation) {
          this.rotation = this.targetRotation;
          this.achievingTargetRotation = false;
          this.physicsEnabled = false;
        }
      }
    }

    this.doorObject.setRotationFromEuler(
      new THREE.Euler(0, this.sideMultiplier * this.rotation, 0)
    );
  }

  public open() {
    this.achievingTargetRotation = true;
    this.targetRotation = 1;
  }

  public close() {
    this.achievingTargetRotation = true;
    this.targetRotation = 0;
  }
}

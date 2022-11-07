import { StateType } from "../../../enums/StateType";
import { VehicleSeat } from "../../../vehicles/VehicleSeat";
import { Character } from "../../Character";
import { CharacterStateBase } from "../CharacterStateBase";

export class Driving extends CharacterStateBase {
  private seat: VehicleSeat;

  constructor(character: Character, seat: VehicleSeat) {
    super(character, StateType.Driving);

    this.seat = seat;
    this.canFindVehiclesToEnter = false;
    this.playAnimation("driving");

    //this.character.startControllingVehicle(seat.vehicle, this.seat);
    //this.seat.vehicle.onInputChange();
    this.character.vehicleEntryInstance = null;
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    // if (
    //   !this.seat.door?.achievingTargetRotation &&
    //   this.seat.door?.rotation > 0 &&
    //   this.seat.vehicle.noDirectionPressed()
    // ) {
    //   this.character.setState(new CloseVehicleDoorInside(this.character, this.seat));
    // }
  }
}

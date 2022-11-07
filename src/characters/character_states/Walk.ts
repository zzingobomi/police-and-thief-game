import { StateType } from "../../enums/StateType";
import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.Walk);

    this.canEnterVehicles = true;
    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation("run");
  }

  public update(delta: number): void {
    super.update(delta);

    this.character.setCameraRelativeOrientationTarget();

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.noDirection()) {
      this.character.setState(
        Utils.characterStateFactory(StateType.EndWalk, this.character)
      );
    }

    if (this.character.actions.run.isPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Sprint, this.character)
      );
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Sprint, this.character)
      );
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpRunning, this.character)
      );
    }

    if (this.noDirection()) {
      if (this.character.velocity.length() > 1) {
        this.character.setState(
          Utils.characterStateFactory(StateType.EndWalk, this.character)
        );
      } else {
        this.character.setState(
          Utils.characterStateFactory(StateType.Idle, this.character)
        );
      }
    }
  }
}

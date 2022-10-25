import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import * as Utils from "../../utils/FunctionLibrary";

export class DropRunning extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.DropRunning);

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation("drop_running");
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    if (this.animationEnded(timeStep)) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Walk, this.character)
      );
    }
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.noDirection()) {
      this.character.setState(
        Utils.characterStateFactory(StateType.EndWalk, this.character)
      );
    }

    if (this.anyDirection() && this.character.actions.run.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Sprint, this.character)
      );
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpRunning, this.character)
      );
    }
  }
}

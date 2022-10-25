import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import * as Utils from "../../utils/FunctionLibrary";

export class DropRolling extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.DropRolling);

    this.character.velocitySimulator.mass = 1;
    this.character.velocitySimulator.damping = 0.6;

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation("drop_running_roll");
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();

    if (this.animationEnded(timeStep)) {
      if (this.anyDirection()) {
        this.character.setState(
          Utils.characterStateFactory(StateType.Walk, this.character)
        );
      } else {
        this.character.setState(
          Utils.characterStateFactory(StateType.EndWalk, this.character)
        );
      }
    }
  }
}

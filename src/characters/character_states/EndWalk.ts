import * as Utils from "../../utils/FunctionLibrary";
import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";

export class EndWalk extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.EndWalk);

    this.character.setArcadeVelocityTarget(0);
    this.animationLength = character.getAnimationLength("stop");
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    if (this.animationEnded(timeStep)) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Idle, this.character)
      );
    }

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpIdle, this.character)
      );
    }

    if (this.anyDirection()) {
      if (this.character.actions.run.isPressed) {
        this.character.setState(
          Utils.characterStateFactory(StateType.Sprint, this.character)
        );
      } else {
        if (this.character.velocity.length() > 0.5) {
          this.character.setState(
            Utils.characterStateFactory(StateType.Walk, this.character)
          );
        } else {
          this.setAppropriateStartWalkState();
        }
      }
    }
  }
}

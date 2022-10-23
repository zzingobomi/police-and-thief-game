import { StateType } from "../../enums/StateType";
import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";

export class IdleRotateRight extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.IdleRotateRight);

    this.character.rotationSimulator.mass = 30;
    this.character.rotationSimulator.damping = 0.6;

    this.character.velocitySimulator.damping = 0.6;
    this.character.velocitySimulator.mass = 10;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation("rotate_right");
  }

  public update(delta: number): void {
    super.update(delta);

    if (this.animationEnded(delta)) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Idle, this.character)
      );
    }
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.anyDirection()) {
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

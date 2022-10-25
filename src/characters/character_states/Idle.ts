import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import * as Utils from "../../utils/FunctionLibrary";

export class Idle extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.Idle);

    this.character.velocitySimulator.damping = 0.6;
    this.character.velocitySimulator.mass = 10;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation("idle");
  }

  public update(delta: number): void {
    super.update(delta);

    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    super.onInputChange();

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpIdle, this.character)
      );
    }

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

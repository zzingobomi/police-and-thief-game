import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import * as Utils from "../../utils/FunctionLibrary";

export class DropIdle extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.DropIdle);

    this.character.velocitySimulator.damping = 0.5;
    this.character.velocitySimulator.mass = 7;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation("drop_idle");

    if (this.anyDirection()) {
      this.character.setState(
        Utils.characterStateFactory(StateType.StartWalkForward, this.character)
      );
    }
  }

  public update(timeStep: number): void {
    super.update(timeStep);
    this.character.setCameraRelativeOrientationTarget();
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
      this.character.setState(
        Utils.characterStateFactory(StateType.StartWalkForward, this.character)
      );
    }
  }
}

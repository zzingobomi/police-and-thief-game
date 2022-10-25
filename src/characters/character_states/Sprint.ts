import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import * as Utils from "../../utils/FunctionLibrary";

export class Sprint extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.Sprint);

    this.character.velocitySimulator.mass = 10;
    this.character.rotationSimulator.damping = 0.8;
    this.character.rotationSimulator.mass = 50;

    this.character.setArcadeVelocityTarget(1.4);
    this.playAnimation("sprint");
  }

  public update(timeStep: number): void {
    super.update(timeStep);
    this.character.setCameraRelativeOrientationTarget();
    this.fallInAir();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (!this.character.actions.run.isPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Walk, this.character)
      );
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpRunning, this.character)
      );
    }

    if (this.noDirection()) {
      this.character.setState(
        Utils.characterStateFactory(StateType.EndWalk, this.character)
      );
    }
  }
}

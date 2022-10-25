import * as Utils from "../../utils/FunctionLibrary";
import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";

export class Falling extends CharacterStateBase {
  constructor(character: Character) {
    super(character, StateType.Falling);

    this.character.velocitySimulator.mass = 100;
    this.character.rotationSimulator.damping = 0.3;

    this.character.arcadeVelocityIsAdditive = true;
    this.character.setArcadeVelocityInfluence(0.05, 0, 0.05);

    this.playAnimation("falling");
  }

  public update(timeStep: number): void {
    super.update(timeStep);

    this.character.setCameraRelativeOrientationTarget();
    this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0);

    if (this.character.rayHasHit) {
      this.setAppropriateDropState();
    }
  }
}

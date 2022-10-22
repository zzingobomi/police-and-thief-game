import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import { Walk } from "./Walk";

export class Idle extends CharacterStateBase {
  constructor(character: Character) {
    super(character);

    this.character.velocitySimulator.damping = 0.6;
    this.character.velocitySimulator.mass = 10;

    this.character.setArcadeVelocityTarget(0);
    this.playAnimation("idle");
  }

  public update(delta: number): void {
    super.update(delta);
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.anyDirection()) {
      if (this.character.velocity.length() > 0.5) {
        this.character.setState(new Walk(this.character));
      } else {
        this.setAppropriateStartWalkState();
      }
    }
  }
}

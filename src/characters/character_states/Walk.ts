import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import { STATE_Idle } from "./StateConst";

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character);

    this.character.setArcadeVelocityTarget(0.8);
    this.playAnimation("run");
  }

  public update(delta: number): void {
    super.update(delta);

    this.character.setCameraRelativeOrientationTarget();
  }

  public onInputChange(): void {
    super.onInputChange();

    if (this.noDirection()) {
      if (this.character.velocity.length() > 1) {
        //this.character.setState(new EndWalk(this.character));
      } else {
        this.character.setState(
          Utils.characterStateFactory(STATE_Idle, this.character)
        );
      }
    }
  }
}

import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";
import { Idle } from "./Idle";
import {
  STATE_Idle,
  STATE_IdleRotateLeft,
  STATE_IdleRotateRight,
  STATE_Walk,
} from "./StateConst";
import { Walk } from "./Walk";

export class StartWalkBase extends CharacterStateBase {
  constructor(character: Character) {
    super(character);

    this.character.rotationSimulator.mass = 20;
    this.character.rotationSimulator.damping = 0.7;

    this.character.setArcadeVelocityTarget(0.8);
  }

  public update(delta: number) {
    super.update(delta);

    if (this.animationEnded(delta)) {
      this.character.setState(
        Utils.characterStateFactory(STATE_Walk, this.character)
      );
    }

    this.character.setCameraRelativeOrientationTarget();
  }

  public onInputChange() {
    super.onInputChange();

    if (this.noDirection()) {
      if (this.timer < 0.1) {
        const angle = Utils.getSignedAngleBetweenVectors(
          this.character.orientation,
          this.character.orientationTarget
        );

        if (angle > Math.PI * 0.4) {
          this.character.setState(
            Utils.characterStateFactory(STATE_IdleRotateLeft, this.character)
          );
        } else if (angle < -Math.PI * 0.4) {
          this.character.setState(
            Utils.characterStateFactory(STATE_IdleRotateRight, this.character)
          );
        } else {
          this.character.setState(
            Utils.characterStateFactory(STATE_Idle, this.character)
          );
        }
      } else {
        this.character.setState(
          Utils.characterStateFactory(STATE_Idle, this.character)
        );
      }
    }
  }
}

import { StateType } from "../../enums/StateType";
import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { CharacterStateBase } from "./CharacterStateBase";

export class StartWalkBase extends CharacterStateBase {
  constructor(character: Character, name: string) {
    super(character, name);

    this.canEnterVehicles = true;

    this.character.rotationSimulator.mass = 20;
    this.character.rotationSimulator.damping = 0.7;

    this.character.setArcadeVelocityTarget(0.8);
  }

  public update(delta: number) {
    super.update(delta);

    if (this.animationEnded(delta)) {
      this.character.setState(
        Utils.characterStateFactory(StateType.Walk, this.character)
      );
    }

    this.character.setCameraRelativeOrientationTarget();

    this.fallInAir();
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
            Utils.characterStateFactory(
              StateType.IdleRotateLeft,
              this.character
            )
          );
        } else if (angle < -Math.PI * 0.4) {
          this.character.setState(
            Utils.characterStateFactory(
              StateType.IdleRotateRight,
              this.character
            )
          );
        } else {
          this.character.setState(
            Utils.characterStateFactory(StateType.Idle, this.character)
          );
        }
      } else {
        this.character.setState(
          Utils.characterStateFactory(StateType.Idle, this.character)
        );
      }
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(
        Utils.characterStateFactory(StateType.JumpRunning, this.character)
      );
    }
  }
}

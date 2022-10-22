import * as Utils from "../../utils/FunctionLibrary";
import { Character } from "../Character";
import { ICharacterState } from "../../interfaces/ICharacterState";
import {
  STATE_StartWalkBackLeft,
  STATE_StartWalkBackRight,
  STATE_StartWalkForward,
  STATE_StartWalkLeft,
  STATE_StartWalkRight,
} from "./StateConst";

export abstract class CharacterStateBase implements ICharacterState {
  public character: Character;
  public timer: number;
  public animationLength: number;

  constructor(character: Character) {
    this.character = character;

    this.character.velocitySimulator.damping =
      this.character.defaultVelocitySimulatorDamping;
    this.character.velocitySimulator.mass =
      this.character.defaultVelocitySimulatorMass;

    this.character.rotationSimulator.damping =
      this.character.defaultRotationSimulatorDamping;
    this.character.rotationSimulator.mass =
      this.character.defaultRotationSimulatorMass;

    this.character.setArcadeVelocityInfluence(1, 0, 1);

    this.timer = 0;
  }

  public update(delta: number): void {
    this.timer += delta;
  }

  public onInputChange(): void {}

  protected playAnimation(animName: string): void {
    this.animationLength = this.character.getAnimationLength(animName);
  }

  public animationEnded(delta: number) {
    if (this.animationLength === undefined) {
      console.error(
        this.constructor.name +
          "Error: Set this.animationLength in state constructor!"
      );
      return false;
    } else {
      return this.timer > this.animationLength - delta;
    }
  }

  public noDirection(): boolean {
    return (
      !this.character.actions.up.isPressed &&
      !this.character.actions.down.isPressed &&
      !this.character.actions.left.isPressed &&
      !this.character.actions.right.isPressed
    );
  }

  public anyDirection(): boolean {
    return (
      this.character.actions.up.isPressed ||
      this.character.actions.down.isPressed ||
      this.character.actions.left.isPressed ||
      this.character.actions.right.isPressed
    );
  }

  public setAppropriateStartWalkState() {
    const range = Math.PI;
    const angle = Utils.getSignedAngleBetweenVectors(
      this.character.orientation,
      this.character.getCameraRelativeMovementVector()
    );
    if (angle > range * 0.8) {
      this.character.setState(
        Utils.characterStateFactory(STATE_StartWalkBackLeft, this.character)
      );
    } else if (angle < -range * 0.8) {
      this.character.setState(
        Utils.characterStateFactory(STATE_StartWalkBackRight, this.character)
      );
    } else if (angle > range * 0.3) {
      this.character.setState(
        Utils.characterStateFactory(STATE_StartWalkLeft, this.character)
      );
    } else if (angle < -range * 0.3) {
      this.character.setState(
        Utils.characterStateFactory(STATE_StartWalkRight, this.character)
      );
    } else {
      this.character.setState(
        Utils.characterStateFactory(STATE_StartWalkForward, this.character)
      );
    }
  }
}

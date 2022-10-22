import { Character } from "../Character";
import { StartWalkBase } from "./StartWalkBase";

export class StartWalkForward extends StartWalkBase {
  constructor(character: Character) {
    super(character);
    this.animationLength = character.getAnimationLength("start_forward");
  }
}

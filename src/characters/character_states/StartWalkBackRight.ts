import { StateType } from "../../enums/StateType";
import { Character } from "../Character";
import { StartWalkBase } from "./StartWalkBase";

export class StartWalkBackRight extends StartWalkBase {
  constructor(character: Character) {
    super(character, StateType.StartWalkBackRight);
    this.animationLength = character.getAnimationLength("start_back_right");
  }
}

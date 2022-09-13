import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("number")
  positionX: number = 0;
  @type("number")
  positionY: number = 0;
  @type("number")
  positionZ: number = 0;

  @type("number")
  rotationX: number = 0;
  @type("number")
  rotationY: number = 0;
  @type("number")
  rotationZ: number = 0;

  @type("number")
  scaleX: number = 1;
  @type("number")
  scaleY: number = 1;
  @type("number")
  scaleZ: number = 1;
}

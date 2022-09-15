import { Schema, type, MapSchema } from "@colyseus/schema";

class Vec3 extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;
}

export class Player extends Schema {
  @type(Vec3)
  position: Vec3 = new Vec3();

  @type(Vec3)
  rotation: Vec3 = new Vec3();

  @type(Vec3)
  scale: Vec3 = new Vec3();

  @type("string")
  currentState: string = "";
}

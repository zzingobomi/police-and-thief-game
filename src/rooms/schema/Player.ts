import { Schema, type, MapSchema } from "@colyseus/schema";

export class Vec3 extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;

  constructor(x: number, y: number, z: number) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }

  Set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Player extends Schema {
  @type(Vec3)
  position: Vec3 = new Vec3(0, 0, 0);

  @type(Vec3)
  rotation: Vec3 = new Vec3(0, 0, 0);

  @type(Vec3)
  scale: Vec3 = new Vec3(1, 1, 1);

  @type("string")
  currentState: string = "";

  constructor(position: Vec3, rotation: Vec3) {
    super();
    this.position.Set(position.x, position.y, position.z);
    this.rotation.Set(rotation.x, rotation.y, rotation.z);
  }

  SetPosition(position: Vec3) {
    this.position.Set(position.x, position.y, position.z);
  }
  SetRotation(rotation: Vec3) {
    this.rotation.Set(rotation.x, rotation.y, rotation.z);
  }
  SetScale(scale: Vec3) {
    this.scale.Set(scale.x, scale.y, scale.z);
  }
}

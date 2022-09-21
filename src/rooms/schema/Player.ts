import { Schema, type, MapSchema } from "@colyseus/schema";
import { PlayerType } from "../MyRoom";

export class Vec3 extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;

  @type("number")
  z: number = 0;

  constructor(x: number, y: number, z: number);
  constructor(obj: any);
  constructor(...args: Array<any>) {
    super();
    if (args.length === 1) {
      this.x = args[0].x;
      this.y = args[0].y;
      this.z = args[0].z;
    } else {
      this.x = args[0];
      this.y = args[1];
      this.z = args[2];
    }
  }

  Set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Player extends Schema {
  @type("string")
  playerType: string = "";

  @type(Vec3)
  position: Vec3 = new Vec3(0, 0, 0);

  @type(Vec3)
  rotation: Vec3 = new Vec3(0, 0, 0);

  @type(Vec3)
  scale: Vec3 = new Vec3(1, 1, 1);

  @type("string")
  currentState: string = "";

  @type("string")
  nickname: string = "";

  constructor(
    playerType: PlayerType,
    position: Vec3,
    rotation: Vec3,
    nickname: string
  ) {
    super();
    this.position.Set(position.x, position.y, position.z);
    this.rotation.Set(rotation.x, rotation.y, rotation.z);
    this.playerType = playerType;
    this.nickname = nickname;
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

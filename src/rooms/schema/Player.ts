import { Schema, type } from "@colyseus/schema";
import { Vec3, Vec4 } from "./Vector";

export class PlayerState extends Schema {
  @type("string")
  stateName: string = "";

  @type("string")
  animationName: string = "";

  get StateName() {
    return this.stateName;
  }
  set StateName(name: string) {
    this.stateName = name;
  }

  get AnimationName() {
    return this.animationName;
  }
  set AnimationName(name: string) {
    this.animationName = name;
  }
}

export class Player extends Schema {
  @type(Vec3)
  position: Vec3 = new Vec3(0, 0, 0);

  @type(Vec4)
  quaternion: Vec4 = new Vec4(0, 0, 0, 1);

  @type(Vec3)
  scale: Vec3 = new Vec3(1, 1, 1);

  @type(PlayerState)
  state: PlayerState = new PlayerState();

  constructor(position: Vec3, quaternion: Vec4, scale: Vec3) {
    super();
    this.position.Set(position.x, position.y, position.z);
    this.quaternion.Set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    this.scale.Set(scale.x, scale.y, scale.z);
  }

  SetPosition(position: Vec3) {
    this.position.Set(position.x, position.y, position.z);
  }
  SetQuaternion(quaternion: Vec4) {
    this.quaternion.Set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }
  SetScale(scale: Vec3) {
    this.scale.Set(scale.x, scale.y, scale.z);
  }

  SetState(stateName: string, animationName: string) {
    this.state.StateName = stateName;
    this.state.AnimationName = animationName;
  }
}

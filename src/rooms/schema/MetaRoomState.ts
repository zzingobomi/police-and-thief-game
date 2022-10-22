import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player, Vec3, Vec4 } from "./Player";

export class MetaRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(
    sessionId: string,
    position: Vec3,
    quaternion: Vec4,
    scale: Vec3
  ) {
    console.log("createPlayer: ", sessionId);
    this.players.set(sessionId, new Player(position, quaternion, scale));
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  updatePlayerPosition(sessionId: string, position: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.position.Set(position.x, position.y, position.z);
  }
  updatePlayerQuaternion(sessionId: string, quaternion: Vec4) {
    const player = this.players.get(sessionId);
    if (player)
      player.quaternion.Set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
  }
  updatePlayerScale(sessionId: string, scale: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.scale.Set(scale.x, scale.y, scale.z);
  }
}

import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player, Vec3 } from "./Player";

export class MyRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(sessionId: string, initialInfo: Vec3) {
    //console.log("createPlayer: ", sessionId);
    this.players.set(sessionId, new Player(initialInfo));
  }

  // TODO: 아직 작업 안함
  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  updatePlayerPosition(sessionId: string, position: Vec3) {
    const player = this.players.get(sessionId);
    player.position.Set(position.x, position.y, position.z);
  }
  updatePlayerRotation(sessionId: string, rotation: Vec3) {
    const player = this.players.get(sessionId);
    player.rotation.Set(rotation.x, rotation.y, rotation.z);
  }
  updatePlayerScale(sessionId: string, scale: Vec3) {
    const player = this.players.get(sessionId);
    player.scale.Set(scale.x, scale.y, scale.z);
  }
  updatePlayerState(sessionId: string, state: string) {
    const player = this.players.get(sessionId);
    player.currentState = state;
  }

  /*
  updatePlayer(sessionId: string, playerData: Player) {
    const player = this.players.get(sessionId);
    player.position.x = playerData.position.x;
    player.position.y = playerData.position.y;
    player.position.z = playerData.position.z;

    player.rotation.x = playerData.rotation.x;
    player.rotation.y = playerData.rotation.y;
    player.rotation.z = playerData.rotation.z;

    player.currentState = playerData.currentState;
  }
  */
}

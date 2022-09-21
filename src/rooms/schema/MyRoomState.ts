import { Schema, MapSchema, type } from "@colyseus/schema";
import { PlayerType } from "../MyRoom";
import { Player, Vec3 } from "./Player";

export class MyRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(
    sessionId: string,
    playerType: PlayerType,
    initialPosition: Vec3,
    initialRotation: Vec3,
    nickname: string
  ) {
    //console.log("createPlayer: ", sessionId);
    this.players.set(
      sessionId,
      new Player(playerType, initialPosition, initialRotation, nickname)
    );
  }

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
}

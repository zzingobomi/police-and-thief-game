import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player";

export class MyRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(sessionId: string) {
    //console.log("createPlayer: ", sessionId);
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

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
}

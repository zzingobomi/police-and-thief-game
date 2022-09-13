import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "./Player";

export class MyRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(sessionId: string) {
    this.players.set(sessionId, new Player());
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  movePlayer(sessionId: string, movement: any) {
    const player = this.players.get(sessionId);
    player.positionX = movement.positionX;
    player.positionY = movement.positionX;
    player.positionZ = movement.positionX;

    player.rotationX = movement.rotationX;
    player.rotationY = movement.rotationY;
    player.rotationZ = movement.rotationZ;
  }
}

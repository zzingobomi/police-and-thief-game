import { Schema, MapSchema, type } from "@colyseus/schema";
import { PlayerType } from "../MyRoom";
import { Player, Vec3 } from "./Player";

export class MetaRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

import { Client, Room } from "colyseus";
import { World } from "../world/World";
import { MetaRoomState } from "./schema/MetaRoomState";

export class MetaRoom extends Room<MetaRoomState> {
  world = new World();

  onCreate(options: any) {
    console.log("MetaRoom created!", options);

    this.setState(new MetaRoomState());

    this.onMessage("move", (client, data) => {
      console.log("move: ", client.sessionId, ":", data);
      //this.state.movePlayer(client.sessionId, data);
    });
  }

  onJoin(client: Client) {
    console.log("onJoin: ", client.sessionId);
    client.send("hello", "world");
    //this.state.createPlayer(client.sessionId);
  }

  onLeave(client: Client) {
    //this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("Dispose MetaRoom");
  }
}

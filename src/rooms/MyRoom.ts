import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    //this.roomName = options.roomName;
    this.setMetadata({ roomName: options.roomName });
    this.maxClients = options.maxClient;
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.broadcast(
      "joined",
      this.clients.map((client) => client.sessionId)
    );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.broadcast(
      "left",
      this.clients.map((client) => client.sessionId)
    );
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

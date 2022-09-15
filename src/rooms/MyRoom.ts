import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  private initCount = 0;

  onCreate(options: any) {
    this.setMetadata({ roomName: options.roomName });
    this.maxClients = options.maxClient;
    this.setState(new MyRoomState());

    this.onMessage("game.init", (client, data) => {
      this.initCount += 1;
      if (this.initCount >= this.clients.length) {
        for (const client of this.clients) {
          this.state.createPlayer(client.sessionId);
        }
      }
    });

    this.onMessage("world.update", (client, data) => {
      this.state.updatePlayer(client.sessionId, data);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    //this.state.createPlayer(client.sessionId);
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

import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Vec3 } from "./schema/Player";

const playerInitialInfo = [
  {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    position: {
      x: -500,
      y: 0,
      z: 0,
    },
  },
];

export class MyRoom extends Room<MyRoomState> {
  private initCount = 0;

  onCreate(options: any) {
    this.setMetadata({ roomName: options.roomName });
    this.maxClients = options.maxClient;
    this.setState(new MyRoomState());

    this.onMessage("game.init", (client, data) => {
      this.initCount += 1;
      if (this.initCount >= this.clients.length) {
        for (const [index, client] of this.clients.entries()) {
          const initialPosition: Vec3 = new Vec3(
            playerInitialInfo[index].position.x,
            playerInitialInfo[index].position.y,
            playerInitialInfo[index].position.z
          );
          this.state.createPlayer(client.sessionId, initialPosition);
        }
      }
    });

    this.onMessage("update.position", (client, position) => {
      this.state.updatePlayerPosition(client.sessionId, position);
    });
    this.onMessage("update.rotation", (client, rotation) => {
      this.state.updatePlayerRotation(client.sessionId, rotation);
    });
    this.onMessage("update.scale", (client, scale) => {
      this.state.updatePlayerScale(client.sessionId, scale);
    });
    this.onMessage("update.state", (client, state) => {
      this.state.updatePlayerState(client.sessionId, state);
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

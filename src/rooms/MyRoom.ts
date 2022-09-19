import { Room, Client } from "colyseus";
import { policeInitialInfo, thiefInitialInfo } from "./PlayerInitialInfo";
import { MyRoomState } from "./schema/MyRoomState";
import { Vec3 } from "./schema/Player";

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
            policeInitialInfo[index].position.x,
            policeInitialInfo[index].position.y,
            policeInitialInfo[index].position.z
          );
          const initialRotation: Vec3 = new Vec3(
            policeInitialInfo[index].rotation.x,
            policeInitialInfo[index].rotation.y,
            policeInitialInfo[index].rotation.z
          );
          this.state.createPlayer(
            client.sessionId,
            initialPosition,
            initialRotation
          );
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

import { Room, Client } from "colyseus";
import { policeInitialInfo, thiefInitialInfo } from "./PlayerInitialInfo";
import { MyRoomState } from "./schema/MyRoomState";
import { Vec3 } from "./schema/Player";

export enum PlayerType {
  POLICE = "Police",
  THIEF = "Thief",
}

export enum PrepareState {
  PREPARE = "Prepare",
  READY = "Ready",
}

export class MyRoom extends Room<MyRoomState> {
  private readyCount = 0;
  private initCount = 0;

  onCreate(options: any) {
    this.setMetadata({ roomName: options.roomName });
    this.maxClients = options.maxClient;
    this.setState(new MyRoomState());

    this.onMessage("game.ready", (client, data) => {
      client.userData.prepareState = PrepareState.READY;
      const prepareCount = this.clients.filter(
        (client) => client.userData.prepareState === PrepareState.PREPARE
      ).length;
      if (prepareCount <= 0) {
        this.broadcast("game.start");
      }

      this.broadcast(
        "ready.update",
        this.clients.map((client) => {
          return {
            playerType: client.userData.playerType,
            sessionId: client.sessionId,
            prepareState: client.userData.prepareState,
            nickname: client.userData.nickname,
          };
        })
      );
    });

    this.onMessage("game.cancel.ready", (client, data) => {
      client.userData.prepareState = PrepareState.PREPARE;

      this.broadcast(
        "ready.update",
        this.clients.map((client) => {
          return {
            playerType: client.userData.playerType,
            sessionId: client.sessionId,
            prepareState: client.userData.prepareState,
            nickname: client.userData.nickname,
          };
        })
      );
    });

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
            client.userData.playerType,
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
    client.userData = {
      playerType: PlayerType.POLICE,
      prepareState: PrepareState.PREPARE,
      nickname: options.nickname,
    };
    this.clients.length % 2 === 0
      ? (client.userData.playerType = PlayerType.THIEF)
      : (client.userData.playerType = PlayerType.POLICE);

    this.broadcast(
      "joined",
      this.clients.map((client) => {
        return {
          playerType: client.userData.playerType,
          sessionId: client.sessionId,
          prepareState: client.userData.prepareState,
          nickname: client.userData.nickname,
        };
      })
    );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.removePlayer(client.sessionId);
    this.broadcast(
      "left",
      this.clients.map((client) => {
        return {
          playerType: client.userData.playerType,
          sessionId: client.sessionId,
          prepareState: client.userData.prepareState,
          nickname: client.userData.nickname,
        };
      })
    );
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

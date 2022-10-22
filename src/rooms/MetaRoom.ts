import { Client, Room } from "colyseus";
import { World } from "../world/World";
import { MetaRoomState } from "./schema/MetaRoomState";
import * as Utils from "../utils/FunctionLibrary";
import PubSub from "pubsub-js";
import { SignalType } from "../core/SignalType";

export class MetaRoom extends Room<MetaRoomState> {
  world = new World();

  onCreate(options: any) {
    console.log("MetaRoom created!", options);

    this.setState(new MetaRoomState());

    this.onMessage("key.input", (client, data) => {
      //console.log("key.input: ", client.sessionId, data);
      this.world.keyinputCharacter(client.sessionId, data);
      //this.state.movePlayer(client.sessionId, data);
    });

    this.onMessage("view.update", (client, data) => {
      //console.log("view.update: ", client.sessionId, data);
      this.world.viewUpdateCharacter(client.sessionId, data);
    });

    PubSub.subscribe(SignalType.UPDATE_PLAYER_POSITION, (msg, data) => {
      this.state.updatePlayerPosition(
        data.sessionId,
        Utils.three2Vec3(data.position)
      );
    });
    PubSub.subscribe(SignalType.UPDATE_PLAYER_QUATERNION, (msg, data) => {
      this.state.updatePlayerQuaternion(
        data.sessionId,
        Utils.three2Vec4(data.quaternion)
      );
    });
    PubSub.subscribe(SignalType.UPDATE_PLAYER_SCALE, (msg, data) => {
      this.state.updatePlayerScale(
        data.sessionId,
        Utils.three2Vec3(data.scale)
      );
    });
  }

  onJoin(client: Client) {
    console.log("onJoin: ", client.sessionId);
    const playerInfo = this.world.createCharacter(client.sessionId);
    this.state.createPlayer(
      client.sessionId,
      Utils.three2Vec3(playerInfo.position),
      Utils.three2Vec4(playerInfo.quaternion),
      Utils.three2Vec3(playerInfo.scale)
    );
  }

  onLeave(client: Client) {
    this.world.removeCharacter(client.sessionId);
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("Dispose MetaRoom");
  }
}

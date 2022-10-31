import { Schema, MapSchema, type } from "@colyseus/schema";
import { Car } from "./Car";
import { Player } from "./Player";
import { Vec3, Vec4 } from "./Vector";

export class MetaRoomState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type({ map: Car })
  cars = new MapSchema<Car>();

  ///
  /// Player
  ///
  createPlayer(
    sessionId: string,
    position: Vec3,
    quaternion: Vec4,
    scale: Vec3
  ) {
    console.log("createPlayer: ", sessionId);
    this.players.set(sessionId, new Player(position, quaternion, scale));
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  updatePlayerPosition(sessionId: string, position: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.position.Set(position.x, position.y, position.z);
  }
  updatePlayerQuaternion(sessionId: string, quaternion: Vec4) {
    const player = this.players.get(sessionId);
    if (player)
      player.quaternion.Set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
  }
  updatePlayerScale(sessionId: string, scale: Vec3) {
    const player = this.players.get(sessionId);
    if (player) player.scale.Set(scale.x, scale.y, scale.z);
  }

  updatePlayerState(sessionId: string, name: string) {
    const player = this.players.get(sessionId);
    if (player) player.SetStateName(name);
  }

  ///
  /// Car
  ///
  createCar(networkId: string, position: Vec3, quaternion: Vec4, scale: Vec3) {
    this.cars.set(networkId, new Car(position, quaternion, scale));
  }

  removeCar(networkId: string) {
    this.cars.delete(networkId);
  }

  updateCarPosition(networkId: string, position: Vec3) {
    const car = this.cars.get(networkId);
    if (car) car.position.Set(position.x, position.y, position.z);
  }
  updateCarQuaternion(networkId: string, quaternion: Vec4) {
    const car = this.cars.get(networkId);
    if (car)
      car.quaternion.Set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
  }
  updateCarScale(networkId: string, scale: Vec3) {
    const car = this.cars.get(networkId);
    if (car) car.scale.Set(scale.x, scale.y, scale.z);
  }
}

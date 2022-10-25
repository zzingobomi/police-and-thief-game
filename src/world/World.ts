import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as Utils from "../utils/FunctionLibrary";
import * as _ from "lodash";
import path from "path";
import fs from "fs";
import { BoxCollider } from "../physics/colliders/BoxCollider";
import { CollisionGroups } from "../enums/CollisionGroups";
import { TrimeshCollider } from "../physics/colliders/TrimeshCollider";
import { Character } from "../characters/Character";
import { IWorldEntity } from "../interfaces/IWorldEntity";
import { IUpdatable } from "../interfaces/IUpdatable";
import { Vehicle } from "../vehicles/Vehicle";

export class World {
  public physicsWorld: CANNON.World;

  public characters: Character[] = [];
  public vehicles: Vehicle[] = [];

  public updatables: IUpdatable[] = [];
  private previousTime = Date.now();

  constructor() {
    this.initPhysics();
    this.initWorldInfo();
    this.initCharacterInfo();
    this.initVehicleInfo();

    this.update();
  }

  private initPhysics() {
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -9.81, 0);
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    this.physicsWorld.allowSleep = true;
  }

  private update() {
    const deltaTime = Date.now() - this.previousTime;

    this.updatePhysics(deltaTime);

    this.updatables.forEach((entity) => {
      entity.update(deltaTime);
    });

    this.previousTime = Date.now();
    setTimeout(this.update.bind(this), 16);
  }

  private initWorldInfo() {
    const rawData = fs.readFileSync(
      path.join(__dirname, "..", "assets\\json\\world.json"),
      "utf-8"
    );
    const worldData = JSON.parse(rawData);
    for (const data of worldData) {
      if (data.type === "box") {
        const phys = new BoxCollider({
          size: new THREE.Vector3(data.scale[0], data.scale[1], data.scale[2]),
        });
        phys.body.position.set(
          data.position[0],
          data.position[1],
          data.position[2]
        );
        phys.body.quaternion.set(
          data.quaternion[0],
          data.quaternion[1],
          data.quaternion[2],
          data.quaternion[3]
        );
        phys.body.updateAABB(); // 회전값대로 AABB를 다시 계산해줘야 raycastHit 이 제대로 작동함

        // TODO: 정확한 의미 분석하기
        phys.body.shapes.forEach((shape) => {
          shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
        });

        this.physicsWorld.addBody(phys.body);
      } else if (data.type === "trimesh") {
        const phys = new TrimeshCollider(data, {});
        this.physicsWorld.addBody(phys.body);
      }
    }
  }

  private initCharacterInfo() {
    const rawData = fs.readFileSync(
      path.join(__dirname, "..", "assets\\json\\character.json"),
      "utf-8"
    );
    const characterData = JSON.parse(rawData);
    Utils.setCharacterData(characterData);
  }

  private initVehicleInfo() {
    const rawData = fs.readFileSync(
      path.join(__dirname, "..", "assets\\json\\vehicle.json"),
      "utf-8"
    );
    const vehicleData = JSON.parse(rawData);
    for (const data of vehicleData) {
      if (data.type === "car") {
        // TODO:
      }
    }
  }

  public createCharacter(sessionId: string) {
    const player = new Character(sessionId);
    player.setPosition(-0.100830078125, 34.80377197265625, -5.1705322265625);
    player.setOrientation(new THREE.Vector3(0, 0, 1), true);
    this.add(player);

    return {
      position: player.position,
      quaternion: player.quaternion,
      scale: player.scale,
    };
  }

  private updatePhysics(delta: number) {
    this.physicsWorld.step(1 / 60, delta, 3);
  }

  public add(worldEntity: IWorldEntity): void {
    worldEntity.addToWorld(this);
    this.registerUpdatable(worldEntity);
  }

  public registerUpdatable(registree: IUpdatable): void {
    this.updatables.push(registree);
    this.updatables.sort((a, b) => (a.updateOrder > b.updateOrder ? 1 : -1));
  }

  public remove(worldEntity: IWorldEntity): void {
    worldEntity.removeFromWorld(this);
    this.unregisterUpdatable(worldEntity);
  }

  public unregisterUpdatable(registree: IUpdatable): void {
    _.pull(this.updatables, registree);
  }

  public removeCharacter(sessionId: string) {
    const findCharacter = this.updatables.find(
      (char) => char instanceof Character && char.sessionId === sessionId
    ) as IWorldEntity;
    this.remove(findCharacter);
  }

  public keyinputCharacter(sessionId: string, data: any) {
    const findCharacter = this.updatables.find(
      (char) => char instanceof Character && char.sessionId === sessionId
    ) as Character;
    findCharacter.handleKeyboardEvent(data);
  }

  public viewUpdateCharacter(sessionId: string, data: any) {
    const findCharacter = this.updatables.find(
      (char) => char instanceof Character && char.sessionId === sessionId
    ) as Character;
    findCharacter.viewUpdate(data);
  }
}

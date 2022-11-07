import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as Utils from "../utils/FunctionLibrary";
import * as _ from "lodash";
import PubSub from "pubsub-js";
import path from "path";
import fs from "fs";
import { BoxCollider } from "../physics/colliders/BoxCollider";
import { CollisionGroups } from "../enums/CollisionGroups";
import { TrimeshCollider } from "../physics/colliders/TrimeshCollider";
import { Character } from "../characters/Character";
import { IWorldEntity } from "../interfaces/IWorldEntity";
import { IUpdatable } from "../interfaces/IUpdatable";
import { Vehicle } from "../vehicles/Vehicle";
import { Car } from "../vehicles/Car";
import { Scene } from "three";
import { EntityType } from "../enums/EntityType";
import { SignalType } from "../core/SignalType";

export class World {
  public scene: Scene;
  public physicsWorld: CANNON.World;

  public characters: Character[] = [];
  public vehicles: Vehicle[] = [];

  public updatables: IUpdatable[] = [];

  private previousTime = Date.now();

  constructor() {
    this.initScene();
    this.initPhysics();
    this.initWorld();
    this.initCharacterInfo();

    this.update();
  }

  private initScene() {
    const scene = new THREE.Scene();
    this.scene = scene;
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

  private async initWorld() {
    const gltf = await Utils.loadGLTFModel(
      path.join(__dirname, "..", "assets\\glb\\world.glb")
    );
    gltf.scene.traverse((child) => {
      if (child.hasOwnProperty("userData")) {
        if (child.type === "Mesh") {
          // TODO: CSM
        }

        if (child.userData.hasOwnProperty("data")) {
          if (child.userData.data === "physics") {
            if (child.userData.hasOwnProperty("type")) {
              if (child.userData.type === "box") {
                const phys = new BoxCollider({
                  size: new THREE.Vector3(
                    child.scale.x,
                    child.scale.y,
                    child.scale.z
                  ),
                });
                phys.body.position.copy(
                  Utils.three2cannonVector(child.position)
                );
                phys.body.quaternion.copy(
                  Utils.three2cannonQuat(child.quaternion)
                );
                phys.body.updateAABB();

                phys.body.shapes.forEach((shape) => {
                  shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
                });

                this.physicsWorld.addBody(phys.body);
              } else if (
                child.userData.type === "trimesh" &&
                child instanceof THREE.Mesh
              ) {
                const phys = new TrimeshCollider(child, {});
                this.physicsWorld.addBody(phys.body);
              }

              child.visible = false;
            }
          }
          if (child.userData.data === "scenario") {
            if (
              child.userData.hasOwnProperty("default") &&
              child.userData.default === "true"
            ) {
              child.traverse((scenarioData) => {
                if (
                  scenarioData.hasOwnProperty("userData") &&
                  scenarioData.userData.hasOwnProperty("data")
                ) {
                  if (scenarioData.userData.data === "spawn") {
                    if (scenarioData.userData.type === "player") {
                      //this.createMyCharacter(scenarioData);
                    }
                  }
                }
              });
            } else if (
              child.userData.hasOwnProperty("spawn_always") &&
              child.userData.spawn_always === "true"
            ) {
              child.traverse((scenarioData) => {
                if (
                  scenarioData.hasOwnProperty("userData") &&
                  scenarioData.userData.hasOwnProperty("data")
                ) {
                  if (scenarioData.userData.data === "spawn") {
                    if (scenarioData.userData.type === "car") {
                      this.createCar(scenarioData);
                    }
                  }
                }
              });
            }
          }
        }
      }
    });
    this.scene.add(gltf.scene);

    /*
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
    */
  }

  private initCharacterInfo() {
    const rawData = fs.readFileSync(
      path.join(__dirname, "..", "assets\\json\\character.json"),
      "utf-8"
    );
    const characterData = JSON.parse(rawData);
    Utils.setCharacterData(characterData);
  }

  private async createCar(initialData: THREE.Object3D) {
    const model = await Utils.loadGLTFModel(
      path.join(__dirname, "..", "assets\\glb\\car.glb")
    );
    const car = new Car(model);

    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    initialData.getWorldPosition(worldPos);
    initialData.getWorldQuaternion(worldQuat);

    worldPos.y = worldPos.y + 2;
    car.setPosition(worldPos.x, worldPos.y, worldPos.z);
    car.collision.quaternion.copy(Utils.three2cannonQuat(worldQuat));
    car.scale.set(
      initialData.scale.x,
      initialData.scale.y,
      initialData.scale.z
    );

    this.add(car);

    PubSub.publish(SignalType.CREATE_CAR, {
      networkId: car.uuid,
      position: worldPos,
      quaternion: worldQuat,
      scale: initialData.scale,
    });

    /*
    model.scene.traverse((child) => {
      if (child.hasOwnProperty("userData")) {
        if (child.userData.hasOwnProperty("data")) {
          if (child.userData.data === "seat") {
            //this.seats.push(new VehicleSeat(this, child, gltf));
          }
          if (child.userData.data === "camera") {
            //this.camera = child;
          }
          if (child.userData.data === "wheel") {
            //this.wheels.push(new Wheel(child));
          }
          if (child.userData.data === "collision") {
            if (child.userData.shape === "box") {
              const phys = new CANNON.Box(
                new CANNON.Vec3(child.scale.x, child.scale.y, child.scale.z)
              );
              phys.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
              //this.collision.addShape(phys, new CANNON.Vec3(child.position.x, child.position.y, child.position.z));
            } else if (child.userData.shape === "sphere") {
              const phys = new CANNON.Sphere(child.scale.x);
              phys.collisionFilterGroup = CollisionGroups.TrimeshColliders;
              //this.collision.addShape(phys, new CANNON.Vec3(child.position.x, child.position.y, child.position.z));
            }
          }
        }
      }
    });
    */
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

  public getCarsInfo() {
    return this.vehicles.filter(
      (vehicle) => vehicle.entityType === EntityType.Car
    );
  }
}

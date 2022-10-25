import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as _ from "lodash";
import { IWorldEntity } from "../interfaces/IWorldEntity";
import { EntityType } from "../enums/EntityType";
import { World } from "../world/World";
import { Character } from "../characters/Character";

export abstract class Vehicle extends THREE.Object3D implements IWorldEntity {
  public updateOrder: number = 2;
  public abstract entityType: EntityType;

  public controllingCharacter: Character;
  //public rayCastVehicle: CANNON.RaycastVehicle;
  public world: World;

  private modelContainer: THREE.Group;

  constructor() {
    super();

    // TODO: gltf 에서 collider 정보 얻어와야 함..
    this.modelContainer = new THREE.Group();
    this.add(this.modelContainer);
  }

  addToWorld(world: World): void {
    this.world = world;
    world.vehicles.push(this);
  }
  removeFromWorld(world: World): void {
    if (!_.includes(world.vehicles, this)) {
      console.warn(
        "Removing character from a world in which it isn't present."
      );
    } else {
      this.world = undefined;
      _.pull(world.vehicles, this);
    }
  }
  update(delta: number): void {}
}

import { ICollider } from "../../interfaces/ICollider";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Utils from "../../utils/FunctionLibrary";

export class BoxCollider implements ICollider {
  public options: any;
  public body: CANNON.Body;

  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new THREE.Vector3(),
      size: new THREE.Vector3(0.3, 0.3, 0.3),
      friction: 0.3,
    };
    options = Utils.setDefaults(options, defaults);
    this.options = options;

    options.position = new CANNON.Vec3(
      options.position.x,
      options.position.y,
      options.position.z
    );
    options.size = new CANNON.Vec3(
      options.size.x,
      options.size.y,
      options.size.z
    );

    const mat = new CANNON.Material("boxMat");
    mat.friction = options.friction;

    const shape = new CANNON.Box(options.size);

    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      shape,
    });

    physBox.material = mat;

    this.body = physBox;
  }
}

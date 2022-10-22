import { ICollider } from "../../interfaces/ICollider";
import * as CANNON from "cannon-es";
import * as Utils from "../../utils/FunctionLibrary";

export class CapsuleCollider implements ICollider {
  public options: any;
  public body: CANNON.Body;

  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.3,
      segments: 8,
      friction: 0.3,
    };
    options = Utils.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material("capsuleMat");
    mat.friction = options.friction;

    const capsuleBody = new CANNON.Body({
      mass: options.mass,
      position: options.position,
    });

    const sphereShape = new CANNON.Sphere(options.radius);

    capsuleBody.material = mat;

    capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0, 0));
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, options.height / 2, 0)
    );
    capsuleBody.addShape(
      sphereShape,
      new CANNON.Vec3(0, -options.height / 2, 0)
    );

    this.body = capsuleBody;
  }
}

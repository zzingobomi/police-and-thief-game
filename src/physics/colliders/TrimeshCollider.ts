import { ICollider } from "../../interfaces/ICollider";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Utils from "../../utils/FunctionLibrary";
import { Object3D } from "three";

// TODO: mesh.position, quat 가 그냥 numer[] 형태였음.. 그래서 주소값만 넘어가서 AABB가 계산이 안되어 collision 체크가 안됨
// number[] -> cannon.Vec3 로 수동으로 바꾸니 잘 됨
// 타입을 확실히 정해서 미리 컴파일 단계에서 체크할수 있도록 해야할듯..
// 만약 gltf 로드가 제대로 되면 이것도 필요없나?
export class TrimeshCollider implements ICollider {
  public mesh: any;
  public options: any;
  public body: CANNON.Body;

  constructor(mesh: any, options: any) {
    this.mesh = mesh.clone();

    const defaults = {
      mass: 0,
      position: mesh.position,
      rotation: mesh.quaternion,
      friction: 0.3,
    };
    options = Utils.setDefaults(options, defaults);
    this.options = options;

    const mat = new CANNON.Material("triMat");
    mat.friction = options.friction;

    // TODO: position array 가 왜 0일까..
    const shape = Utils.createTrimesh(this.mesh.geometry);

    const physBox = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      quaternion: options.rotation,
      shape: shape,
    });

    physBox.material = mat;

    this.body = physBox;
  }
}

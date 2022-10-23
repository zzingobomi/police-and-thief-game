import { ICollider } from "../../interfaces/ICollider";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as Utils from "../../utils/FunctionLibrary";
import { Object3D } from "three";

// TODO: mesh.position, quat 가 그냥 numer[] 형태였음.. 그래서 주소값만 넘어가서 AABB가 계산이 안되어 collision 체크가 안됨
// number[] -> cannon.Vec3 로 수동으로 바꾸니 잘 됨
// 타입을 확실히 정해서 미리 컴파일 단계에서 체크할수 있도록 해야할듯..
export class TrimeshCollider implements ICollider {
  public mesh: any;
  public options: any;
  public body: CANNON.Body;

  constructor(mesh: any, options: any) {
    this.mesh = mesh;

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

    const shape = new CANNON.Trimesh(
      mesh.geometry.vertices,
      mesh.geometry.indices
    );

    const physBox = new CANNON.Body({
      mass: options.mass,
      position: new CANNON.Vec3(
        options.position[0],
        options.position[1],
        options.position[2]
      ),
      quaternion: new CANNON.Quaternion(
        options.rotation[0],
        options.rotation[1],
        options.rotation[2],
        options.rotation[3]
      ),
      shape: shape,
    });

    physBox.material = mat;

    this.body = physBox;
  }
}

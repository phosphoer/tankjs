(function ()
{
  "use strict";

  var rightConstant = new THREE.Vector3(1, 0, 0);
  var upConstant = new THREE.Vector3(0, 1, 0);
  var forwardConstant = new THREE.Vector3(0, 0, 1);
  var zeroConstant = new THREE.Vector3(0, 0, 0);

  TANK.registerComponent("ThreePos")

  .construct(function ()
  {
    this.object3d = new THREE.Object3D();
    this.object3d.matrixAutoUpdate = true;

    this.position = this.object3d.position;
    this.rotation = this.object3d.rotation;
    this.scale = this.object3d.scale;

    this.vector4Cache = new THREE.Vector4();
    this.worldToLocalCache = new THREE.Matrix4();

    this.getRight = function (vector3Out)
    {
      this.vectorLocalToWorld(rightConstant, vector3Out);
    };

    this.getUp = function (vector3Out)
    {
      this.vectorLocalToWorld(upConstant, vector3Out);
    };

    this.getForward = function (vector3Out)
    {
      this.vectorLocalToWorld(forwardConstant, vector3Out);
    };

    this.getWorldPosition = function (vector3Out)
    {
      this.pointLocalToWorld(zeroConstant, vector3Out);
    };

    this.vectorLocalToWorld = function (vector3, vector3Out)
    {
      this.localToWorld(vector3, vector3Out, 0.0);
    };

    this.pointLocalToWorld = function (vector3, vector3Out)
    {
      this.localToWorld(vector3, vector3Out, 1.0);
    };

    this.vectorWorldToLocal = function (vector3, vector3Out)
    {
      this.worldToLocal(vector3, vector3Out, 0.0);
    };

    this.pointWorldToLocal = function (vector3, vector3Out)
    {
      this.worldToLocal(vector3, vector3Out, 1.0);
    };

    this.localToWorld = function (vector3, vector3Out, w)
    {
      var v4 = this.vector4Cache;

      v4.x = vector3.x;
      v4.y = vector3.y;
      v4.z = vector3.z;
      v4.w = w;

      v4.applyMatrix4(this.object3d.matrixWorld);

      vector3Out.x = v4.x;
      vector3Out.y = v4.y;
      vector3Out.z = v4.z;
    };

    this.worldToLocal = function (vector3, vector3Out, w)
    {
      this.worldToLocalCache.getInverse(this.object3d.matrixWorld);

      var v4 = this.vector4Cache;

      v4.x = vector3.x;
      v4.y = vector3.y;
      v4.z = vector3.z;
      v4.w = w;

      v4.applyMatrix4(this.worldToLocalCache);

      vector3Out.x = v4.x;
      vector3Out.y = v4.y;
      vector3Out.z = v4.z;
    };
  })

  .initialize(function ()
  {
    var addedAsChild = false;

    var mother = this.parent.threeParent;

    if (mother)
    {
      var motherTx = mother.ThreePos;
      if (motherTx)
      {
        motherTx.object3d.add(this.object3d);
        addedAsChild = true;
      }
    }

    if (addedAsChild === false)
    {
      TANK.ThreeRenderer.scene.add(this.object3d);
    }
  })

  .destruct(function ()
  {
    this.object3d.parent.remove(this.object3d);
  });

}(this, this.TANK = this.TANK ||
{}));
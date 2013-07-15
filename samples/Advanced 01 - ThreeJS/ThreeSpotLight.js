TANK.registerComponent("ThreeSpotLight")

.requires("ThreePos")

.construct(function ()
{
  this.offset = new THREE.Object3D();
  this.targetPos = new THREE.Vector3(0, 0, 0);
})

.initialize(function ()
{
  this.light = new THREE.SpotLight(0xffffff, 1, 100);
  this.light.position = new THREE.Vector3(0, 0, 0);
  this.light.castShadow = true;
  this.light.shadowMapWidth = 512;
  this.light.shadowMapHeight = 512;
  this.light.shadowCameraNear = 0.1;
  this.light.shadowCameraFar = 100;
  this.light.shadowCameraFov = 60;
  this.light.shadowDarkness = 0.5;
  // this.light.shadowCameraVisible = true;

  this.offset.add(this.light);
  this.parent.ThreePos.object3d.add(this.offset);
});
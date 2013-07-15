TANK.registerComponent("ThreePointLight")

.requires("ThreePos")

.construct(function ()
{
  this.offset = new THREE.Object3D();
})

.initialize(function ()
{
  this.light = new THREE.PointLight(0xffffff, 1, 100);
  this.light.position = new THREE.Vector3(0, 0, 0);

  this.offset.add(this.light);
  this.parent.ThreePos.object3d.add(this.offset);
});
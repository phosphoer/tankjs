TANK.registerComponent("ThreeHemisphereLight")

.requires("ThreePos")

.construct(function ()
{
  this.light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
})

.initialize(function ()
{
  this.parent.ThreePos.object3d.add(this.light);
});
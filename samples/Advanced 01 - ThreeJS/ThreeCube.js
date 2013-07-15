TANK.registerComponent("ThreeCube")

.requires("ThreePos, ThreeMaterial")

.construct(function ()
{
  this.geometry = new THREE.CubeGeometry(1, 1, 1);
  this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial());
})

.initialize(function()
{
  this.parent.ThreePos.object3d.add(this.mesh);
})

.destruct(function()
{
  this.mesh.parent.remove(this.mesh);
});

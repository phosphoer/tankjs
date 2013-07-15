TANK.registerComponent("ThreeMaterial")

.construct(function ()
{
  this.material = new THREE.MeshLambertMaterial({color: "#fff", shading: THREE.FlatShading});
})

.initialize(function()
{
})

.destruct(function()
{
});

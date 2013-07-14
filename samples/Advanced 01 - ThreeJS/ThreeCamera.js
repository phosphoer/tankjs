TANK.registerComponent("ThreeCamera")

.requires("ThreePos")

.construct(function ()
{
  // Create camera
  var fov = 60;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 1000;
  this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  // Look at position
  this.targetPos = new THREE.Vector3(0, 0, 0);
})

.initialize(function()
{
  // Add camera
  this.camera.position = this.parent.ThreePos.position;
  TANK.ThreeRenderer.scene.add(this.camera);
  TANK.ThreeRenderer.camera = this.camera;

  // Track target
  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.camera.lookAt(this.targetPos);
    this.parent.ThreePos.position.z += dt;
    this.parent.ThreePos.position.y += dt;
  });
})

.destruct(function()
{

});

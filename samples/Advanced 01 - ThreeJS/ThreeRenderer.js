TANK.registerComponent("ThreeRenderer")

.construct(function ()
{
  // Create a THREE scene
  this.scene = new THREE.Scene();

  // Create renderer
  this.renderer = new THREE.WebGLRenderer(
  {
    antialias: true
  });

  // Create canvas
  this.container = document.createElement("div");
  this.container.className = "fullscreen";

  // Listen for window resize
  var that = this;
  window.onresize = function(event)
  {
    that.camera.aspect = window.innerWidth / window.innerHeight;
    that.camera.updateProjectionMatrix();
    that.renderer.setSize(window.innerWidth, window.innerHeight);
  }
})

.initialize(function()
{
  // Init renderer
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor("#222", 1);
  this.renderer.gammaInput = true;
  this.renderer.gammaOutput = true;

  // Init canvas
  document.body.appendChild(this.container);
  this.container.appendChild(this.renderer.domElement);

  // Render every frame
  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
  });
})

.destruct(function()
{
});

function main()
{
  TANK.addComponents("InputManager, ThreeRenderer");

  var camera = TANK.createEntity("ThreeCamera, ThreePointLight");
  TANK.addEntity(camera);

  var cube = TANK.createEntity("ThreeModel");
  cube.ThreeModel.url = "res/monkey.obj";
  TANK.addEntity(cube);

  // Rotate around cube
  camera.ThreeCamera.et = 0;
  camera.ThreeCamera.addEventListener("OnEnterFrame", function(dt)
  {
    this.et += dt;
    this.parent.ThreePos.position.x = Math.cos(this.et) * 3;
    this.parent.ThreePos.position.z = Math.sin(this.et) * 3;
    this.parent.ThreePos.position.y = 3;
  });

  TANK.start();
}
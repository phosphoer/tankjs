function main()
{
  TANK.addComponents("InputManager, ThreeRenderer");

  var camera = TANK.createEntity("ThreeCamera");
  TANK.addEntity(camera);

  var cube = TANK.createEntity("ThreeCube");
  TANK.addEntity(cube);

  TANK.start();
}
function main()
{
  TANK.addComponents("InputManager, ThreeRenderer");

  var camera = TANK.createEntity("ThreeCamera");
  TANK.addEntity(camera);

  var cube = TANK.createEntity("ThreeCube");
  cube.ThreeMaterial.material.color = "#844";
  TANK.addEntity(cube);

  TANK.start();
}
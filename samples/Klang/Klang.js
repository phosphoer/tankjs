function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.addObject("Engine").addComponents("InputManager, Canvas, CollisionManager, RenderManager");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.attr("RenderManager", {context: e.getComponent("Canvas").context})

  // Create a bullet object prefab
  TankJS.addPrefab("Bullet",
  {
    "ColoredBox": { width: 5, height: 5 },
    "Velocity": {},
    "Collider": { width: 5, height: 5 },
    "DeleteOnCollide": {},
    "DeleteOutOfBounds": {}
  });

  // Create a player object
  TankJS.addObject("Player").addComponents("Image, TopDownMovement, RotateController, ObjectSpawner, Collider")
                            .attr("2D", {x: 300, y: 50})
                            .attr("Image", {imagePath: "res/BlueBall.png"})
                            .attr("ObjectSpawner", {objectPrefab: "Bullet"});

  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 100, y: 100}).attr("Collider", {isStatic: true});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 100, y: 150}).attr("Collider", {isStatic: true});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 150, y: 150}).attr("Collider", {isStatic: true});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 200, y: 150}).attr("Collider", {isStatic: true});

  TankJS.start();
}
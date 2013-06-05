function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.addObject("Engine").addComponents("InputManager, Canvas, CollisionManager, RenderManager");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.attr("RenderManager", {context: e.getComponent("Canvas").context})

  // Create a player object
  TankJS.addObject("Player").addComponents("ColoredBox, TopDownMovement, Collider").attr("2D", {x: 300, y: 50});;
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 100, y: 100});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 100, y: 150});

  TankJS.start();
}
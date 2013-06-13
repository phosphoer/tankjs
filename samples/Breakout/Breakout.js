function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.addObject("Engine").addComponents("InputManager, Canvas, CollisionManager, RenderManager, GameLogic");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.RenderManager.context = e.Canvas.context;

  // Begin running the engine
  TankJS.start();
}

// Custom game logic component to manage general state of game
TankJS.addComponent("GameLogic")

.initFunction(function()
{
  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
});
TankJS.addComponent("TopDownMovement")

.includes("2D")

.initFunction(function()
{
  this.velocity = [0, 0];

  TankJS.addEventListener("OnKeyPressed", this);
  TankJS.addEventListener("OnKeyReleased", this);
  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnKeyPressed", this);
  TankJS.removeEventListener("OnKeyReleased", this);
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnKeyPressed", function(key)
{
  console.log("press");
  this.velocity[0] = 10;
})

.addFunction("OnKeyReleased", function(key)
{
  this.velocity[0] = 0;
})

.addFunction("OnEnterFrame", function(dt)
{
  var t = this.parent.getComponent("2D");
  t.x += this.velocity[0] * dt;
  t.y += this.velocity[1] * dt;
});
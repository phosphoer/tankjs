TankJS.addComponent("Velocity")

.includes("2D")

.initFunction(function()
{
  this.x = 0;
  this.y = 0;

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  var t = this.parent.getComponent("2D");
  t.x += this.x * dt;
  t.y += this.y * dt;
});
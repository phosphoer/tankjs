TankJS.addComponent("RotateController")

.includes("Pos2D")

.initFunction(function()
{
  this.left = false;
  this.right = false;
  this.rotateSpeed = 2;

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
  if (key == TankJS.Q)
    this.left = true;
  else if (key == TankJS.E)
    this.right = true;
})

.addFunction("OnKeyReleased", function(key)
{
  if (key == TankJS.Q)
    this.left = false;
  else if (key == TankJS.E)
    this.right = false;
})

.addFunction("OnEnterFrame", function(dt)
{
  var t = this.parent.Pos2D;
  if (this.left)
    t.rotation -= this.rotateSpeed * dt;
  if (this.right)
    t.rotation += this.rotateSpeed * dt;
});
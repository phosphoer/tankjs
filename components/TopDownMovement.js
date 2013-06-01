TankJS.addComponent("TopDownMovement")

.includes("2D")

.initFunction(function()
{
  this.left = false;
  this.up = false;
  this.right = false;
  this.down = false;
  this.movementSpeed = 50;

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
  if (key == TankJS.W)
    this.up = true;
  else if (key == TankJS.A)
    this.left = true;
  else if (key == TankJS.S)
    this.down = true;
  else if (key == TankJS.D)
    this.right = true;
})

.addFunction("OnKeyReleased", function(key)
{
  if (key == TankJS.W)
    this.up = false;
  else if (key == TankJS.A)
    this.left = false;
  else if (key == TankJS.S)
    this.down = false;
  else if (key == TankJS.D)
    this.right = false;
})

.addFunction("OnEnterFrame", function(dt)
{
  var t = this.parent.getComponent("2D");
  if (this.left)
    t.x -= this.movementSpeed * dt;
  if (this.up)
    t.y -= this.movementSpeed * dt;
  if (this.right)
    t.x += this.movementSpeed * dt;
  if (this.down)
    t.y += this.movementSpeed * dt;
});
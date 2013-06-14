TankJS.addComponent("TopDownMovement")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.up = false;
  this.right = false;
  this.down = false;
  this.movementSpeed = 50;

  TankJS.addEventListener("OnKeyPress", this);
  TankJS.addEventListener("OnKeyRelease", this);
  TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnKeyPress", this);
  TankJS.removeEventListener("OnKeyRelease", this);
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnKeyPress", function (key)
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

.addFunction("OnKeyRelease", function (key)
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

.addFunction("OnEnterFrame", function (dt)
{
  var t = this.parent.Pos2D;
  if (this.left)
    t.x -= this.movementSpeed * dt;
  if (this.up)
    t.y -= this.movementSpeed * dt;
  if (this.right)
    t.x += this.movementSpeed * dt;
  if (this.down)
    t.y += this.movementSpeed * dt;
});
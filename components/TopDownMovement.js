TANK.registerComponent("TopDownMovement")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.up = false;
  this.right = false;
  this.down = false;
  this.movementSpeed = 50;

  TANK.addEventListener("OnKeyPress", this);
  TANK.addEventListener("OnKeyRelease", this);
  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnKeyPress", this);
  TANK.removeEventListener("OnKeyRelease", this);
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnKeyPress", function (key)
{
  if (key == TANK.W)
    this.up = true;
  else if (key == TANK.A)
    this.left = true;
  else if (key == TANK.S)
    this.down = true;
  else if (key == TANK.D)
    this.right = true;
})

.addFunction("OnKeyRelease", function (key)
{
  if (key == TANK.W)
    this.up = false;
  else if (key == TANK.A)
    this.left = false;
  else if (key == TANK.S)
    this.down = false;
  else if (key == TANK.D)
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
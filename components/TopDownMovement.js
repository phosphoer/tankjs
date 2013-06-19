TANK.registerComponent("TopDownMovement")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.up = false;
  this.right = false;
  this.down = false;
  this.movementSpeed = 50;
})

.initialize(function ()
{
  this.addEventListener("OnKeyPress", this.OnKeyPress);
  this.addEventListener("OnKeyRelease", this.OnKeyRelease);
  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnKeyPress", this.OnKeyPress);
  this.removeEventListener("OnKeyRelease", this.OnKeyRelease);
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
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
TANK.registerComponent("RotateController")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.right = false;
  this.rotateSpeed = 2;

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
  if (key == TANK.Q)
    this.left = true;
  else if (key == TANK.E)
    this.right = true;
})

.addFunction("OnKeyRelease", function (key)
{
  if (key == TANK.Q)
    this.left = false;
  else if (key == TANK.E)
    this.right = false;
})

.addFunction("OnEnterFrame", function (dt)
{
  var t = this.parent.Pos2D;
  if (this.left)
    t.rotation -= this.rotateSpeed * dt;
  if (this.right)
    t.rotation += this.rotateSpeed * dt;
});
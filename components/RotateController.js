TANK.registerComponent("RotateController")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.right = false;
  this.rotateSpeed = 2;

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
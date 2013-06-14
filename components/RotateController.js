TankJS.registerComponent("RotateController")

.requires("Pos2D")

.construct(function ()
{
  this.left = false;
  this.right = false;
  this.rotateSpeed = 2;

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
  if (key == TankJS.Q)
    this.left = true;
  else if (key == TankJS.E)
    this.right = true;
})

.addFunction("OnKeyRelease", function (key)
{
  if (key == TankJS.Q)
    this.left = false;
  else if (key == TankJS.E)
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
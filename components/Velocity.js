TANK.registerComponent("Velocity")

.requires("Pos2D")

.construct(function ()
{
  this.x = 0;
  this.y = 0;

  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  var t = this.parent.Pos2D;
  t.x += this.x * dt;
  t.y += this.y * dt;
});
TANK.registerComponent("Velocity")

.requires("Pos2D")

.construct(function ()
{
  this.x = 0;
  this.y = 0;
})

.initialize(function ()
{
  this.OnEnterFrame = function (dt)
  {
    var t = this.parent.Pos2D;
    t.x += this.x * dt;
    t.y += this.y * dt;
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})
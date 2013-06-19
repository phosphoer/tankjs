TANK.registerComponent("DeleteOutOfBounds")

.requires("Pos2D")

.construct(function ()
{
  this.topLeft = [0, 0];
  this.bottomRight = [640, 480];
})

.initialize(function ()
{
  this.OnEnterFrame = function (dt)
  {
    var t = this.parent.Pos2D;
    if (!TANK.Math.pointInRect([t.x, t.y], this.topLeft, this.bottomRight))
      TANK.removeEntity(this.parent);
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})
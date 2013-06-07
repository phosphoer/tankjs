TankJS.addComponent("DeleteOutOfBounds")

.includes("2D")

.initFunction(function()
{
  this.topLeft = [0, 0];
  this.bottomRight = [640, 480];

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  var t = this.parent.getComponent("2D");
  if (!TankJS.Math.pointInRect([t.x, t.y], this.topLeft, this.bottomRight))
    this.parent.remove();
});
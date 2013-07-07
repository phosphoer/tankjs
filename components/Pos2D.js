TANK.registerComponent("Pos2D")

.construct(function ()
{
  this.x = 0;
  this.y = 0;
  this.rotation = 0;

  this.onTransform = function(Pos3D)
  {
    this.x = Pos3D.x;
    this.y = Pos3D.z;
    this.rotation = Pos3D.yRotation;
  }
});

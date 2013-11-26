TANK.registerComponent("DeleteOnCollide")

.initialize(function ()
{
  this.OnCollide = function (obj)
  {
    this.space.removeEntity(this.parent);
  };
});
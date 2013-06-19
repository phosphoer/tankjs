TANK.registerComponent("DeleteOnCollide")

.initialize(function ()
{
  this.OnCollide = function (obj)
  {
    TANK.removeEntity(this.parent);
  };
});
TANK.registerComponent("DeleteOnCollide")

.addFunction("OnCollide", function (obj)
{
  this.parent.remove();
});
TankJS.addComponent("DeleteOnCollide")

.addFunction("OnCollide", function(obj)
{
  this.parent.remove();
});
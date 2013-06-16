TANK.registerComponent("DeleteOnCollide")

.addFunction("OnCollide", function (obj)
{
    TANK.removeEntity(this.parent);
});
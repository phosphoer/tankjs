TANK.registerComponent("DeleteOutOfBounds")

.requires("Pos2D")

.construct(function ()
{
    this.topLeft = [0, 0];
    this.bottomRight = [640, 480];
})

.initialize(function ()
{
    TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
    TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
    var t = this.parent.Pos2D;
    if (!TANK.Math.pointInRect([t.x, t.y], this.topLeft, this.bottomRight))
        TANK.removeEntity(this.parent);
});
TankJS.registerComponent("DeleteOutOfBounds")

.requires("Pos2D")

.construct(function ()
{
    this.topLeft = [0, 0];
    this.bottomRight = [640, 480];
})

.initialize(function ()
{
    TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
    TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
    var t = this.parent.Pos2D;
    if (!TankJS.Math.pointInRect([t.x, t.y], this.topLeft, this.bottomRight))
        this.parent.remove();
});
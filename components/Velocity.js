TankJS.registerComponent("Velocity")

.requires("Pos2D")

.construct(function ()
{
    this.x = 0;
    this.y = 0;

    TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
    TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
    var t = this.parent.Pos2D;
    t.x += this.x * dt;
    t.y += this.y * dt;
});
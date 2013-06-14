TankJS.registerComponent("CustomUpdate")

.initialize(function ()
{
    this.func = function () {};

    TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
    TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
    this.func.apply(this.parent, [dt]);
});
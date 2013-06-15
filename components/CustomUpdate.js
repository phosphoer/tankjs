TANK.registerComponent("CustomUpdate")

.initialize(function ()
{
  this.func = function () {};

  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  this.func.apply(this.parent, [dt]);
});
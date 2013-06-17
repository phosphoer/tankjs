TANK.registerComponent("CustomUpdate")

.construct(function ()
{
  this.func = function () {};
})

.initialize(function ()
{
  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})

.addFunction("OnEnterFrame", function (dt)
{
  this.func.apply(this.parent, [dt]);
});
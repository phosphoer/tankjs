TankJS.addComponent("CustomUpdate")

.initFunction(function()
{
  this.func = function() {};

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  this.func.apply(this.parent, [dt]);
});
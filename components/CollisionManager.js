TankJS.addComponent("CollisionManager")

.initFunction(function()
{
  this._colliders = {};

  var existing = TankJS.getComponentsWithTag("Collidable");
  for (var i in existing)
    this._colliders[existing[i].parent.id] = existing[i];

  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnComponentInitialized", this);
  TankJS.addEventListener("OnComponentUninitialized", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnComponentInitialized", this);
  TankJS.removeEventListener("OnComponentUninitialized", this);
})

.addFunction("OnComponentInitialized", function(c)
{
  if (c.tags["Collidable"])
  {
    this._colliders[c.parent.id] = c;
  }
})

.addFunction("OnComponentUninitialized", function(c)
{
  if (c.tags["Collidable"])
  {
    delete this._colliders[c.parent.id];
  }
})

.addFunction("OnEnterFrame", function(dt)
{
  for (var i in this._colliders)
  {
    var c = this._colliders[i];
    for (var j in this._colliders)
    {
      if (i === j)
        continue;
      c.collide(this._colliders[j]);
    }
  }
});
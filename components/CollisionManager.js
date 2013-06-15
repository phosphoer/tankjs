TANK.registerComponent("CollisionManager")

.initialize(function ()
{
  this._colliders = {};

  var existing = TANK.getComponentsWithInterface("Collidable");
  for (var i in existing)
    this._colliders[existing[i].parent.id] = existing[i];

  TANK.addEventListener("OnEnterFrame", this);
  TANK.addEventListener("OnComponentInitialized", this);
  TANK.addEventListener("OnComponentUninitialized", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnEnterFrame", this);
  TANK.removeEventListener("OnComponentInitialized", this);
  TANK.removeEventListener("OnComponentUninitialized", this);
})

.addFunction("OnComponentInitialized", function (c)
{
  if (c.interfaces["Collidable"])
  {
    this._colliders[c.parent.id] = c;
  }
})

.addFunction("OnComponentUninitialized", function (c)
{
  if (c.interfaces["Collidable"])
  {
    delete this._colliders[c.parent.id];
  }
})

.addFunction("OnEnterFrame", function (dt)
{
  for (var i in this._colliders)
  {
    var c = this._colliders[i];
    if (c.isStatic)
      continue;

    for (var j in this._colliders)
    {
      if (i === j)
        continue;

      if (c.collide(this._colliders[j]))
      {
        c.parent.invoke("OnCollide", this._colliders[j].parent);
      }
      else
      {}
    }
  }
});
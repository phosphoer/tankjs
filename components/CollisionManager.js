TankJS.addComponent("CollisionManager")

.initialize(function ()
{
  this._colliders = {};

  var existing = TankJS.getComponentsWithInterface("Collidable");
  for (var i in existing)
    this._colliders[existing[i].parent.id] = existing[i];

  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnComponentInitialized", this);
  TankJS.addEventListener("OnComponentUninitialized", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnComponentInitialized", this);
  TankJS.removeEventListener("OnComponentUninitialized", this);
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
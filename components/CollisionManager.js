TANK.registerComponent("CollisionManager")

.initialize(function ()
{
  this._colliders = {};

  var existing = this.space.getComponentsWithInterface("Collidable");
  for (var i in existing)
    this._colliders[existing[i].parent.id] = existing[i];

  this.update = function (dt)
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
      }
    }
  };

  this.addEventListener("OnComponentInitialized", function (c)
  {
    if (c.interfaces["Collidable"])
    {
      this._colliders[c.parent.id] = c;
    }
  });

  this.addEventListener("OnComponentUninitialized", function (c)
  {
    if (c.interfaces["Collidable"])
    {
      delete this._colliders[c.parent.id];
    }
  });
});
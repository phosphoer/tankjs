TANK.registerComponent("RenderManager")

.construct(function ()
{
  this.context = null;
  this._drawables = {};
  this._drawablesSorted = [];
})

.initialize(function ()
{
  this.sort = function ()
  {
    this._drawablesSorted = [];
    for (var i in this._drawables)
      this._drawablesSorted.push(this._drawables[i]);
    this._drawablesSorted.sort(function (a, b)
    {
      return a.zdepth - b.zdepth;
    });
  };

  var existing = this.space.getComponentsWithInterface("Drawable");
  for (var i in existing)
    this._drawables[existing[i].name + existing[i].parent.id] = existing[i];
  this.sort();

  this.addEventListener("OnEnterFrame", function (dt)
  {
    if (!this.context)
      return;

    for (var i in this._drawablesSorted)
    {
      this._drawablesSorted[i].draw(this.context);
    }
  });

  this.addEventListener("OnComponentInitialized", function (c)
  {
    if (c.interfaces["Drawable"])
    {
      this._drawables[c.name + c.parent.id] = c;
      this.sort();
    }
  });

  this.addEventListener("OnComponentUninitialized", function (c)
  {
    if (c.interfaces["Drawable"])
    {
      delete this._drawables[c.name + c.parent.id];
      this.sort();
    }
  });
})
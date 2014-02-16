TANK.registerComponent("RenderManager")

.construct(function ()
{
  this.context = null;
  this.camera = {x: 0, y: 0, z: 1};
  this.clearColor = "#000";
  this.nearestNeighbor = true;
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


  this.update = function (dt)
  {
    if (!this.context)
      return;

    // Nearest neighbor
    if (this.nearestNeighbor)
    {
      this.context.imageSmoothingEnabled = false;
      this.context.webkitImageSmoothingEnabled = false;
      this.context.mozImageSmoothingEnabled = false;
    }

    this.context.save();
    this.context.fillStyle = this.clearColor;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.restore();

    this.context.save();
    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
    this.context.scale(1 / this.camera.z, 1 / this.camera.z);
    this.context.translate(-this.context.canvas.width / 2, -this.context.canvas.height / 2);
    for (var i in this._drawablesSorted)
    {
      this._drawablesSorted[i].draw(this.context, this.camera, dt);
    }
    this.context.restore();
  };

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
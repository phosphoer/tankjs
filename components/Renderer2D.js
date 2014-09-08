(function()
{
  "use strict";

  TANK.registerComponent("Renderer2D")

  .construct(function()
  {
    this.context = null;
    this.camera = {x: 0, y: 0, z: 1};
    this.clearColor = "#000";
    this.nearestNeighbor = true;
    this._drawables = {};
    this._drawablesSorted = [];
  })

  .initialize(function()
  {
    // Add a component to be drawn
    this.add = function(component)
    {
      if (component.zdepth === undefined)
      {
        console.warn("A component was added to Renderer2D with an undefined zdepth");
        component.zdepth = 0;
      }
      this._drawables[component._name + component._entity._id] = component;
      this._sort();
    };

    // Remove a component from drawing
    this.remove = function(component)
    {
      delete this._drawables[component._name + component._entity._id];
      this._sort();
    };

    this._sort = function()
    {
      this._drawablesSorted = [];
      for (var i in this._drawables)
        this._drawablesSorted.push(this._drawables[i]);
      this._drawablesSorted.sort(function (a, b)
      {
        return a.zdepth - b.zdepth;
      });
    };

    this.update = function(dt)
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

      // Clear screen
      this.context.save();
      this.context.fillStyle = this.clearColor;
      this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.restore();

      // Translate camera to center of screen
      // and scale for zoom
      this.context.save();
      this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
      this.context.scale(1 / this.camera.z, 1 / this.camera.z);

      // Draw all drawables
      var isDirty = false;
      var component;
      for (var i = 0; i < this._drawablesSorted.length; ++i)
      {
        component = this._drawablesSorted[i];
        if (!component._initialized)
        {
          delete this._drawables[component._name + component._entity._id];
          isDirty = true;
        }
        else
          this._drawablesSorted[i].draw(this.context, this.camera, dt);
      }
      this.context.restore();

      if (isDirty)
        this._sort();
    };
  });
})();
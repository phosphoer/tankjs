(function()
{
  "use strict";

  TANK.registerComponent("Image")
  .includes("Pos2D")
  .construct(function ()
  {
    this.image = new Image();
    this.scale = 1;
    this.pivotPoint = [0, 0];
  })
  .initialize(function()
  {
    // Store some components
    var t = this._entity.Pos2D;

    // Check if we can find a render manager to register with
    if (!this._entity._parent)
    {
      console.error("The Entity the Image component was added to has no parent");
      return;
    }
    else if (!this._entity._parent.Renderer2D)
    {
      console.error("The Image component couldn't find a Renderer2D to register with");
      return;
    }

    // Add ourselves to render manager
    this._entity._parent.Renderer2D.add(this);

    // Draw function
    this.draw = function(ctx, camera)
    {
      if (!this.image)
        return;

      ctx.save();
      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.rotate(t.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.translate(this.image.width / -2 + this.pivotPoint[0], this.image.height / -2 + this.pivotPoint[1]);
      ctx.drawImage(this.image, 0, 0);
      ctx.restore();
    };
  });

})();
TankJS.addComponent("Image")

.tags("Drawable")

.includes("Pos2D")

.initFunction(function()
{
  this.zdepth = 0;
  this._image = new Image();

  addProperty(this, "imagePath",
    function()
    {
      return this._image.src;
    },
    function(val)
    {
      this._image.src = val;
    });

  addProperty(this, "width",
    function()
    {
      return this._image.width;
    },
    function(val)
    {
    });

  addProperty(this, "height",
    function()
    {
      return this._image.height;
    },
    function(val)
    {
    });
})

.addFunction("draw", function(ctx)
{
  var t = this.parent.Pos2D;
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.rotate(t.rotation)
  ctx.translate(-this.width / 2, -this.height / 2);
  ctx.drawImage(this._image, 0, 0);
  ctx.restore();
});
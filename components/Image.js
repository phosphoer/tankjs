TankJS.registerComponent("Image")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function ()
{
  this.zdepth = 0;
  this.centered = true;
  this.subRectOrigin = undefined;
  this.subRectCorner = undefined;
  this._image = new Image();

  addProperty(this, "imagePath", function ()
  {
    return this._image.src;
  }, function (val)
  {
    this._image.src = val;
  });

  addProperty(this, "width", function ()
  {
    if (!this.subRectOrigin)
      return this._image.width;
    return this.subRectCorner[0] - this.subRectOrigin[0];
  }, function (val)
  {
    if (this.subRectOrigin)
      this.subRectCorner[0] = this.subRectOrigin[0] + val;
  });

  addProperty(this, "height", function ()
  {
    if (!this.subRectOrigin)
      return this._image.height;
    return this.subRectCorner[1] - this.subRectOrigin[1];
  }, function (val)
  {
    if (this.subRectOrigin)
      this.subRectCorner[1] = this.subRectOrigin[1] + val;
  });
})

.addFunction("draw", function (ctx)
{
  var t = this.parent.Pos2D;
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.rotate(t.rotation)
  if (this.centered)
    ctx.translate(-this.width / 2, -this.height / 2);

  if (this.subRectOrigin)
    ctx.drawImage(this._image, this.subRectOrigin[0], this.subRectOrigin[1], this.width, this.height, 0, 0, this.width, this.height);
  else
    ctx.drawImage(this._image, 0, 0);

  ctx.restore();
});
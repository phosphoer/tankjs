TANK.registerComponent("ColoredBox")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function ()
{
  this.zdepth = 0;
  this.width = 50;
  this.height = 50;
  this.color = "#000";
  this.centered = true;
})

.initialize(function()
{
  this.draw = function (ctx)
  {
    var t = this.parent.Pos2D;
    ctx.save();
    ctx.fillStyle = this.color;

    if (this.centered)
      ctx.fillRect(t.x - this.width / 2, t.y - this.height / 2, this.width, this.height);
    else
      ctx.fillRect(t.x, t.y, this.width, this.height);

    ctx.restore();
  };
});

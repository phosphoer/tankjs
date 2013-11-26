TANK.registerComponent("Text")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function ()
{
  this.zdepth = 0;
  this.color = "#000";
  this.text = "";
  this.offsetX = 0;
  this.offsetY = 0;
})

.initialize(function ()
{
  this.draw = function (ctx)
  {
    var t = this.parent.Pos2D;

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.lineWidth = 0;
    ctx.fillText(this.text, t.x + this.offsetX, t.y + this.offsetY);
    ctx.restore();
  };
});
TankJS.addComponent("ColoredBox")

.tags("Drawable")

.includes("2D")

.initFunction(function()
{
  this.zdepth = 0;
  this.width = 50;
  this.height = 50;
  this.color = "#000";
})

.addFunction("draw", function(ctx)
{
  var t = this.parent.getComponent("2D");
  ctx.fillStyle = this.color;
  ctx.fillRect(t.x - this.width / 2, t.y - this.height / 2, this.width, this.height);
});
TankJS.addComponent("Sprite")

.tags("Drawable")

.includes("2D")

.initFunction(function()
{
  this.zdepth = 0;
})

.addFunction("draw", function(ctx)
{
  var t = this.parent.getComponent("2D");
  ctx.fillStyle = "#000";
  ctx.fillRect(t.x, t.y, 50, 50);
});
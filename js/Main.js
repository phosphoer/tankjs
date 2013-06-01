function main()
{
  TankJS.addComponent("Sprite")
        .tags("Drawable")
        .initFunction(function()
        {
          this.zdepth = 0;
        })
        .addFunction("draw", function(ctx)
        {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, 50, 50);
        });

  var c = TankJS.addObject("Canvas").addComponents("Canvas");
  TankJS.addObject("Manager").addComponents("RenderManager").attr("RenderManager", {context: c.getComponent("Canvas").context});
  TankJS.addObject("Player").addComponents("Sprite");

  TankJS.start();
}
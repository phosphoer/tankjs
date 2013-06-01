function main()
{
  var e = TankJS.addObject("Engine")
          .addComponents("InputManager, Canvas, RenderManager");
  e.attr("RenderManager", {context: e.getComponent("Canvas").context})

  TankJS.addObject("Player").addComponents("Sprite, TopDownMovement");

  TankJS.start();
}
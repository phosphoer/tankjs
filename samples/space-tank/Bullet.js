(function()
{
  "use strict";

  // Register the Bullet component
  TANK.registerComponent("Bullet")
  .includes(["Velocity", "Collider2D"])
  .construct(function()
  {
    this.zdepth = 0;
    this.life = 5;
  })
  .initialize(function()
  {
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    // Add ourselves to the renderer so we can perform custom drawing
    // on the context
    // This is auto cleaned up when we are removed
    TANK.main.Renderer2D.add(this);

    // Implement the update loop to count down our life
    this.update = function(dt)
    {
      this.life -= dt;
      if (this.life < 0)
        this._entity._parent.removeChild(this._entity);
    };

    // Implement the draw function, which is called
    // by the renderer
    // The draw function passes in the canvas context, the camera object, and
    // delta time in seconds
    this.draw = function(ctx, camera, dt)
    {
      ctx.save();
      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.fillStyle ="#fff";
      ctx.fillRect(0, 0, 5, 5);
      ctx.restore();
    };
  });

})();
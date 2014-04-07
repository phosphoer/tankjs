(function()
{
  "use strict";

  TANK.registerComponent("Bullet")
  .includes(["Velocity", "Collider2D"])
  .construct(function()
  {
    this.life = 5;
  })
  .initialize(function()
  {
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    TANK.main.Renderer2D.add(this);

    this.update = function(dt)
    {
      this.life -= dt;
      if (this.life < 0)
        this._entity._parent.removeChild(this._entity);
    };

    this.draw = function(ctx, camera)
    {
      ctx.save();
      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.fillStyle ="#fff";
      ctx.fillRect(0, 0, 5, 5);
      ctx.restore();
    };
  });

})();
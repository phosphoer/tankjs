(function()
{
  "use strict";

  TANK.registerComponent("Enemy")
  .includes(["Image", "Velocity", "Collider2D"])
  .construct(function()
  {
    this.speed = 10 + Math.random() * 50;
  })
  .initialize(function()
  {
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    this._entity.Image.image.src = "enemy.png";
    this._entity.Image.scale = 2;
    this._entity.Collider2D.width = 128;
    this._entity.Collider2D.height = 128;

    v.x = -this.speed;

    this.listenTo(this._entity, "OnCollide", function(entity)
    {
      this._entity._parent.removeChild(this._entity);
      entity._parent.removeChild(entity);
    });

    this.update = function(dt)
    {
      if (this.x < TANK.main.Renderer2D.camera.x - window.innerWidth)
        this._entity._parent.removeChild(this._entity);
    };
  });

})();
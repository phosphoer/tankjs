(function()
{
  "use strict";

  TANK.registerComponent("Velocity")
  .includes("Pos2D")
  .construct(function()
  {
    this.x = 0;
    this.y = 0;
    this.r = 0;
  })
  .initialize(function()
  {
    this.getSpeed = function()
    {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    this.update = function(dt)
    {
      var t = this._entity.Pos2D;
      t.x += this.x * dt;
      t.y += this.y * dt;
      t.rotation += this.r * dt;
    };
  });

})();
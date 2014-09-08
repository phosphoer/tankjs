(function()
{
  "use strict";

  TANK.registerComponent("Pos2D")
  .construct(function()
  {
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
  })
  .serialize(function(serializer)
  {
    serializer.property(this, 'x', 0);
    serializer.property(this, 'y', 0);
  });

})();
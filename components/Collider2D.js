(function()
{
  "use strict";

  TANK.registerComponent("Collider2D")
  .includes("Pos2D")
  .construct(function ()
  {
    this.width = 0;
    this.height = 0;
    this.ignored = {};
    this.collisionLayer = "";
    this.collidesWith = [""];
  })
  .initialize(function ()
  {
    this.update = function(dt)
    {
      var colliders = this._entity._parent.getChildrenWithComponent("Collider2D");
      for (var i in colliders)
      {
        var collider = colliders[i].Collider2D;
        if (collider !== this && this.collide(collider))
        {
          this._entity.dispatch("collide", collider._entity);
        }
      }
    };

    this.collide = function (other)
    {
      if (this.width === 0 || this.height === 0)
      {
        return TANK.Math.pointInOBB([this._entity.Pos2D.x, this._entity.Pos2D.y],
                               [other._entity.Pos2D.x, other._entity.Pos2D.y], [other.width, other.height],
                               other._entity.Pos2D.rotation);
      }
      else if (other.width === 0 || other.height === 0)
      {
        return TANK.Math.pointInOBB([other._entity.Pos2D.x, other._entity.Pos2D.y],
                               [this._entity.Pos2D.x, this._entity.Pos2D.y], [this.width, this.height],
                               this._entity.Pos2D.rotation);
      }
      else
      {
        return TANK.Math.AABBInAABB([this._entity.Pos2D.x, this._entity.Pos2D.y], [this.width, this.height],
                               [other._entity.Pos2D.x, other._entity.Pos2D.y], [other.width, other.height]);
      }
      return false;
    };
  });

})();
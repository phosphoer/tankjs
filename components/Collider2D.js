(function()
{
  'use strict';

  TANK.registerComponent('Collider2D')
  .includes('Pos2D')
  .construct(function ()
  {
    this.width = 1;
    this.height = 1;
    this.collisionLayer = '';
    this.collidesWith = [];

    this.testCollision = function (other)
    {
      if (this.width === 1 || this.height === 1)
      {
        return TANK.Math2D.pointInOBB([this._entity.Pos2D.x, this._entity.Pos2D.y],
                               [other._entity.Pos2D.x, other._entity.Pos2D.y], [other.width, other.height],
                               other._entity.Pos2D.rotation);
      }
      else if (other.width === 1 || other.height === 1)
      {
        return TANK.Math2D.pointInOBB([other._entity.Pos2D.x, other._entity.Pos2D.y],
                               [this._entity.Pos2D.x, this._entity.Pos2D.y], [this.width, this.height],
                               this._entity.Pos2D.rotation);
      }
      else
      {
        return TANK.Math2D.AABBInAABB([this._entity.Pos2D.x, this._entity.Pos2D.y], [this.width, this.height],
                               [other._entity.Pos2D.x, other._entity.Pos2D.y], [other.width, other.height]);
      }
      return false;
    };
  })
  .serialize(function (serializer)
  {
    serializer.property(this, 'width', 0);
    serializer.property(this, 'height', 0);
    serializer.property(this, 'collisionLayer', '');
    serializer.property(this, 'collidesWith', []);
  })
  .initialize(function ()
  {
    // Check if we can find a render manager to register with
    var space = this._entity.getFirstParentWithComponent('CollisionManager');
    if (!space)
      console.error('The Collider2D component couldn\'t find a CollisionManager to register with');
    space.CollisionManager.add(this);
  });

})();
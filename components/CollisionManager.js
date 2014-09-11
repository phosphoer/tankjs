(function()
{
  'use strict';

  TANK.registerComponent('CollisionManager')
  .construct(function()
  {
    this._colliders = [];
  })
  .initialize(function()
  {
    this.add = function(component)
    {
      if (!component.collidesWith)
        component.collidesWith = [];

      if (!component.width)
        console.error('A component was added to CollisionManager with no width');
      else if (!component.height)
        console.error('A component was added to CollisionManager with no height');
      else if (typeof component.testCollision !== 'function')
        console.error('A component was added to CollisionManager with no testCollision function');
      else if (!component.collisionLayer && component.collidesWith.length > 0)
        console.error('A component was added to CollisionManager with collidesWith but no collisionLayer');
      else if (!component.collidesWith.length && component.collisionLayer)
        console.error('A component was added to CollisionManager with collisionLayer but no collidesWith');

      // Default collision layer
      if (!component.collisionLayer)
      {
        component.collisionLayer = 'default';
        component.collidesWith = ['default'];
      }

      this._colliders.push(component);
    };

    this.remove = function(component)
    {
      var index = this._colliders.indexOf(component);
      this._colliders.splice(index, 1);
    };

    this.update = function(dt)
    {
      this._colliders = this._colliders.filter(function(c) {return c._initialized;});

      for (var i = 0; i < this._colliders.length; ++i)
      {
        this._checkCollisionOnComponent(i);
      }
    };

    this._checkCollisionOnComponent = function(index)
    {
      for (var i = index + 1; i < this._colliders.length; ++i)
      {
        this._testCollision(this._colliders[index], this._colliders[i]);
      }
    };

    this._testCollision = function(a, b)
    {
      if (a.collidesWith.indexOf(b.collisionLayer) >= 0)
      {
        if (a.testCollision(b))
        {
          a._entity.dispatch('collide', b._entity);
          b._entity.dispatch('collide', a._entity);
        }
      }
      else if (b.collidesWith.indexOf(a.collisionLayer) >= 0)
      {
        if (b.testCollision(a))
        {
          a._entity.dispatch('collide', b._entity);
          b._entity.dispatch('collide', a._entity);
        }
      }
    };
  });

})();
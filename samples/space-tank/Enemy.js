(function()
{
  'use strict';

  // Register the Enemy component and include
  // the Image, Velocity, and Collider2D components as required
  // components
  TANK.registerComponent('Enemy')
  .includes(['Image', 'Velocity', 'Collider2D'])
  .construct(function()
  {
    //  Set movement speed
    this.speed = 10 + Math.random() * 50;
  })
  .initialize(function()
  {
    // Store sibling components for use later on
    // This is a bad idea if the components might be removed at runtime.
    // But I don't plan on ever removing Pos2D or Velocity from this object.
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    // Set image source and also the collider width
    // I set the size of the collider manually but it should
    // really be tied to the image
    this._entity.Image.image.src = 'enemy.png';
    this._entity.Image.scale = 2;
    this._entity.Collider2D.width = 128;
    this._entity.Collider2D.height = 128;

    // Set initial speed
    v.x = -this.speed;

    // Listen to the collide event on our own entity
    this.listenTo(this._entity, 'collide', function(entity)
    {
      this._entity._parent.removeChild(this._entity);
      entity._parent.removeChild(entity);
    });

    // Overriding the update function to get an update call every frame
    this.update = function(dt)
    {
      // Remove entity if we go off the screen to the left
      if (this.x < TANK.main.Renderer2D.camera.x - window.innerWidth)
        this._entity._parent.removeChild(this._entity);
    };
  });

})();
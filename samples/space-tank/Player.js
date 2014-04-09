(function()
{
  "use strict";

  // Register the Player component and mark the Image
  // and Velocity components as required.
  // The Image and Velocity components both include
  // Pos2D themselves
  TANK.registerComponent("Player")
  .includes(["Image", "Velocity"])
  .construct(function()
  {
    // Set some default values for the Player controller
    // Define things in the constructor that you want to be able to
    // override before initialize() is called
    this.speed = 100;
    this.gravity = 400;
    this.fuelDrain = 4;
    this.fuelGain = 2;
    this.fuel = 10;
    this.jumpThrust = 500;
    this.up = false;
    this.gunAngle = -Math.PI / 6;
  })
  .initialize(function()
  {
    // Store sibling components for use later on
    // This is a bad idea if the components might be removed at runtime.
    // But I don't plan on ever removing Pos2D or Velocity from this object.
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    // Load the image for the player
    this._entity.Image.image.src = "space-tank.png";
    this._entity.Image.scale = 5;
    this._entity.Image.pivotPoint[1] = -8;

    // Set initial horizontal speed
    v.x = this.speed;

    // Define a function for shooting
    this.shoot = function()
    {
      // Create a new entity using the Bullet component and position it
      // accordingly
      var e = new TANK.Entity("Bullet");
      e.Pos2D.x = t.x + Math.cos(this.gunAngle + t.rotation) * 50;
      e.Pos2D.y = t.y - 40 + Math.sin(this.gunAngle + t.rotation) * 50;
      e.Velocity.x = Math.cos(this.gunAngle + t.rotation) * 700;
      e.Velocity.y = Math.sin(this.gunAngle + t.rotation) * 700;
      TANK.main.addChild(e);
    };

    // Implement the update function to get access to the update loop
    // dt is passed in as seconds
    this.update = function(dt)
    {
      // Update fuel
      this.fuel += this.fuelGain * dt;
      if (this.fuel > 10)
        this.fuel = 10;

      // Get the ground component from the Level entity
      var ground = TANK.main.getChild("Level").Ground;

      // Gravity
      var groundHeight = ground.getHeight(t.x);
      if (t.y < groundHeight)
      {
        v.y += this.gravity * dt;
      }
      else
      {
        v.y = 0;
        t.y = groundHeight;
        t.rotation = ground.getAngle(t.x);
      }

      // Handle thrust
      if (this.up && this.fuel > 0)
      {
        this.fuel -= this.fuelDrain * dt;
        v.y -= this.jumpThrust * dt;
      }

      // Move camera
      TANK.main.Renderer2D.camera.x = t.x + 400;
    };

    // Listen for the keydown event on the main engine entity
    // since that is the one with the Input component on it
    this.listenTo(TANK.main, "keydown", function(e)
    {
      if (e.keyCode === TANK.Key.W)
        this.up = true;
      if (e.keyCode === TANK.Key.SPACE)
        this.shoot();
    });

    this.listenTo(TANK.main, "keyup", function(e)
    {
      if (e.keyCode === TANK.Key.W)
        this.up = false;
    });
  });

})();
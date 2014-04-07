(function()
{
  "use strict";

  TANK.registerComponent("Player")
  .includes(["Image", "Velocity"])
  .construct(function()
  {
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
    var t = this._entity.Pos2D;
    var v = this._entity.Velocity;

    this._entity.Image.image.src = "space-tank.png";
    this._entity.Image.scale = 5;
    this._entity.Image.pivotPoint[1] = -8;

    v.x = this.speed;

    this.shoot = function()
    {
      var e = new TANK.Entity("Bullet");
      e.Pos2D.x = t.x + Math.cos(this.gunAngle + t.rotation) * 50;
      e.Pos2D.y = t.y - 40 + Math.sin(this.gunAngle + t.rotation) * 50;
      e.Velocity.x = Math.cos(this.gunAngle + t.rotation) * 700;
      e.Velocity.y = Math.sin(this.gunAngle + t.rotation) * 700;
      TANK.main.addChild(e);
    };

    this.update = function(dt)
    {
      // Update fuel
      this.fuel += this.fuelGain * dt;
      if (this.fuel > 10)
        this.fuel = 10;

      var ground = TANK.main.getChild("Level").Ground;

      // Gravity
      var groundHeight = ground.getHeight(t.x);
      if (t.y < groundHeight)
        v.y += this.gravity * dt;
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
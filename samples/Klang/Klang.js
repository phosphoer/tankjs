function main()
{
  // Create the "engine" object with the main components
  TANK.addComponents("InputManager, CollisionManager, RenderManager, GameLogic");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  TANK.RenderManager.context = document.getElementById("screen").getContext("2d");
  TANK.InputManager.context = document.getElementById("stage");

  // Create a bullet object prefab
  TANK.addPrefab("Bullet",
  {
    "ColoredBox":
    {
      width: 5,
      height: 5
    },
    "Velocity":
    {},
    "Collider":
    {
      width: 5,
      height: 5
    },
    "DeleteOnCollide":
    {},
    "DeleteOutOfBounds":
    {},
    "DamageOnCollide":
    {}
  });

  // Create background object
  var bg = TANK.createEntity().addComponents("ColoredBox");
  bg.ColoredBox.width = 640;
  bg.ColoredBox.height = 480;
  bg.ColoredBox.color = "#fff";
  bg.ColoredBox.zdepth = -1;
  bg.ColoredBox.centered = false;
  TANK.addEntity(bg);

  // Create a player object
  var player = TANK.createEntity("Text, Image, TopDownMovement, RotateController, ObjectSpawner, Collider, Health, HealthUpdater");
  player.Pos2D.x = 150;
  player.Pos2D.y = 100;
  player.Image.imagePath = "res/BlueBall.png";
  player.Health.max = 20;
  player.Health.value = 20;
  player.Text.color = "#000";
  player.Text.zdepth = 1;
  player.Text.offsetX = -5;
  player.Text.offsetY = 4;
  player.ObjectSpawner.objectPrefab = "Bullet";
  player.ObjectSpawner.triggerKey = TANK.SPACE;
  TANK.addEntity(player, "Player");

  // Create AI object
  var ai = TANK.createEntity("Text, Image, KlangAI, ObjectSpawner, Collider, Health, HealthUpdater");
  ai.Pos2D.x = 450;
  ai.Pos2D.y = 400;
  ai.Image.imagePath = "res/RedBall.png";
  ai.Health.max = 20;
  ai.Health.value = 20;
  ai.Text.color = "#000";
  ai.Text.zdepth = 1;
  ai.Text.offsetX = -5;
  ai.Text.offsetY = 4;
  ai.ObjectSpawner.objectPrefab = "Bullet";
  TANK.addEntity(ai, "AI");

  // Create walls around edges
  var obj;
  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 640 / 2;
  obj.Pos2D.y = -25;
  obj.Collider.isStatic = true;
  obj.Collider.width = 640;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 640 / 2;
  obj.Pos2D.y = 480 + 25;
  obj.Collider.isStatic = true;
  obj.Collider.width = 640;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = -25;
  obj.Pos2D.y = 480 / 2;
  obj.Collider.isStatic = true;
  obj.Collider.height = 480;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 640 + 25;
  obj.Pos2D.y = 480 / 2;
  obj.Collider.isStatic = true;
  obj.Collider.height = 480;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 100;
  obj.Pos2D.y = 150;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 150;
  obj.Pos2D.y = 150;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 200;
  obj.Pos2D.y = 150;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 200;
  obj.Pos2D.y = 100;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 400;
  obj.Pos2D.y = 350;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 450;
  obj.Pos2D.y = 350;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 500;
  obj.Pos2D.y = 350;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider");
  obj.Pos2D.x = 500;
  obj.Pos2D.y = 400;
  obj.Collider.isStatic = true;
  TANK.addEntity(obj);

  TANK.start();
}

// This component does damage to an object when it collides with it
TANK.registerComponent("DamageOnCollide")

.initialize(function ()
{
  this.OnCollide = function (other)
  {
    other.invoke("TakeDamage", 1);
  };
});

// This component updates the display of the health counter on the balls
TANK.registerComponent("HealthUpdater")

.initialize(function ()
{
  this.addEventListener("OnEnterFrame", function ()
  {
    this.parent.Text.text = this.parent.Health.value;
  });
});

// Custom game logic component to manage general state of game
TANK.registerComponent("GameLogic")

.initialize(function ()
{
  this.OnEnterFrame = function (dt)
  {
    if (!TANK.getEntity("Player") || !TANK.getEntity("AI"))
    {
      TANK.reset();
    }
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})


// Custom component to implement AI for the other player
TANK.registerComponent("KlangAI")

.requires("Pos2D")

.initialize(function ()
{
  this._desiredAngle = 0;
  this._rotateTimer = 0;
  this._rotateAmount = 0.5;
  this._movementSpeed = 50;
  this._left = false;
  this._up = false;
  this._right = false;
  this._down = false;

  this.OnEnterFrame = function (dt)
  {
    this._rotateTimer -= dt;

    var player = TANK.getEntity("Player");
    if (!player)
      return;

    var playerPos = player.Pos2D;
    var pos = this.parent.Pos2D;
    var gun = this.parent.ObjectSpawner;

    // Shoot randomly
    if (Math.random() < 0.05)
      gun.spawn();

    // Move around semi-randomly
    if (Math.random() < 0.01)
      this._up = true;
    if (Math.random() < 0.01)
      this._left = true;
    if (Math.random() < 0.01)
      this._right = true;
    if (Math.random() < 0.01)
      this._down = true;
    if (Math.random() < 0.01)
      this._up = false;
    if (Math.random() < 0.01)
      this._left = false;
    if (Math.random() < 0.01)
      this._right = false;
    if (Math.random() < 0.01)
      this._down = false;

    // Apply movement
    if (this._left)
      pos.x -= this._movementSpeed * dt;
    if (this._up)
      pos.y -= this._movementSpeed * dt;
    if (this._right)
      pos.x += this._movementSpeed * dt;
    if (this._down)
      pos.y += this._movementSpeed * dt;

    // Aim at player
    var angle = TANK.Math.angleToPoint([pos.x, pos.y], [playerPos.x, playerPos.y]);
    if (this._rotateTimer <= this._rotateAmount)
    {
      if (pos.rotation < angle)
        pos.rotation += 0.1;
      else
        pos.rotation -= 0.1;
    }
    if (this._rotateTimer <= 0)
    {
      this._rotateTimer = this._rotateAmount + Math.random() * 3 + 0.5;
      this._rotateAmount = 0.1 + Math.random() * 1;
    }
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})
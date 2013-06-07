function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.addObject("Engine").addComponents("InputManager, Canvas, CollisionManager, RenderManager");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.attr("RenderManager", {context: e.getComponent("Canvas").context})

  // Create a bullet object prefab
  TankJS.addPrefab("Bullet",
  {
    "ColoredBox": { width: 5, height: 5 },
    "Velocity": {},
    "Collider": { width: 5, height: 5 },
    "DeleteOnCollide": {},
    "DeleteOutOfBounds": {}
  });

  // Create a player object
  TankJS.addObject("Player").addComponents("Image, TopDownMovement, RotateController, ObjectSpawner, Collider")
                            .attr("2D", {x: 300, y: 50})
                            .attr("Image", {imagePath: "res/BlueBall.png"})
                            .attr("ObjectSpawner", {objectPrefab: "Bullet", triggerKey: TankJS.SPACE});

  // Create AI object
  TankJS.addObject("AI").addComponents("Image, KlangAI, ObjectSpawner, Collider")
                        .attr("2D", {x: 300, y: 50})
                        .attr("Image", {imagePath: "res/RedBall.png"})
                        .attr("ObjectSpawner", {objectPrefab: "Bullet"});


  // Create walls around edges
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 640 / 2, y: -25}).attr("Collider", {isStatic: true, width: 640});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 640 / 2, y: 480 + 25}).attr("Collider", {isStatic: true, width: 640});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: -25, y: 480 / 2}).attr("Collider", {isStatic: true, height: 480});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 640 + 25, y: 480 / 2}).attr("Collider", {isStatic: true, height: 480});


  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 100, y: 150}).attr("Collider", {isStatic: true});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 150, y: 150}).attr("Collider", {isStatic: true});
  TankJS.addObject().addComponents("ColoredBox, Collider").attr("2D", {x: 200, y: 150}).attr("Collider", {isStatic: true});

  TankJS.start();
}

// Custom component to implement AI for the other player

TankJS.addComponent("KlangAI")

.includes("2D")

.initFunction(function()
{
  this._desiredAngle = 0;
  this._rotateTimer = 0;
  this._rotateAmount = 0.5;
  this._movementSpeed = 50;
  this._left = false;
  this._up = false;
  this._right = false;
  this._down = false;

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  this._rotateTimer -= dt;

  var player = TankJS.getNamedObject("Player");
  var playerPos = player.getComponent("2D");
  var pos = this.parent.getComponent("2D");
  var gun = this.parent.getComponent("ObjectSpawner");

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
  var angle = TankJS.Math.angleToPoint([pos.x, pos.y], [playerPos.x, playerPos.y]);
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
});
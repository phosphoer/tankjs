function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.addObject("Engine").addComponents("InputManager, CollisionManager, RenderManager, GameLogic");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.RenderManager.context = document.getElementById("screen").getContext("2d");
  e.InputManager.context = document.getElementById("stage");

  // Add background object
  TankJS.addObject().addComponents("Image").attr("Image", {imagePath: "res/bg_prerendered.png", centered: false});

  // Add paddle
  var player = TankJS.addObject("Player").addComponents("Image, Paddle");
  player.Image.imagePath = "res/tiles.png";
  player.Image.subRectOrigin = [0, 64];
  player.Image.subRectCorner = [48, 80];
  player.Image.zdepth = 1;
  player.Pos2D.x = 160;
  player.Pos2D.y = 376;

  // Define a ball prefab so it is easy to quickly spawn them
  TankJS.addPrefab("Ball",
  {
    "Image": {imagePath: "res/tiles.png", subRectOrigin: [48, 64], subRectCorner: [64, 80], zdepth: 1},
    "Ball": {},
    "Velocity": {}
  });

  // Define a red brick prefab
  TankJS.addPrefab("RedBrick",
  {
    "Image": {imagePath: "res/tiles.png", subRectOrigin: [0, 32], subRectCorner: [32, 48], zdepth: 1},
    "Brick": {}
  });

  // Define a blue brick prefab
  TankJS.addPrefab("BlueBrick",
  {
    "Image": {imagePath: "res/tiles.png", subRectOrigin: [0, 0], subRectCorner: [32, 16], zdepth: 1},
    "Brick": {}
  });

  // Define a green brick prefab
  TankJS.addPrefab("GreenBrick",
  {
    "Image": {imagePath: "res/tiles.png", subRectOrigin: [0, 48], subRectCorner: [32, 64], zdepth: 1},
    "Brick": {}
  });

  // Define an orange brick prefab
  TankJS.addPrefab("OrangeBrick",
  {
    "Image": {imagePath: "res/tiles.png", subRectOrigin: [0, 16], subRectCorner: [32, 32], zdepth: 1},
    "Brick": {}
  });

  // Begin running the engine
  TankJS.start();
}

// ### Game logic component
// Manages general state of the game
TankJS.addComponent("GameLogic")

.initFunction(function()
{
  // Keep track of how many balls and bricks exist
  this.numBalls = 0;
  this.numBricks = 0;

  // Keep track of player lives
  this.lives = 3;

  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnBallAdded", this);
  TankJS.addEventListener("OnBallRemoved", this);
  TankJS.addEventListener("OnBrickAdded", this);
  TankJS.addEventListener("OnBrickRemoved", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnBallAdded", this);
  TankJS.removeEventListener("OnBallRemoved", this);
  TankJS.removeEventListener("OnBrickAdded", this);
  TankJS.removeEventListener("OnBrickRemoved", this);
})

.addFunction("OnBallAdded", function()
{
  ++this.numBalls;
})

.addFunction("OnBallRemoved", function()
{
  --this.numBalls;
})

.addFunction("OnBrickAdded", function()
{
  ++this.numBricks;
})

.addFunction("OnBrickRemoved", function()
{
  --this.numBricks;
})

.addFunction("OnEnterFrame", function(dt)
{
  // If no balls exist, spawn a new one and decrement lives
  if (this.numBalls === 0)
  {
    --this.lives;
    if (this.lives === 0)
      TankJS.reset();
    else
    {
      // Create a new ball
      var ball = TankJS.addObjectFromPrefab("Ball");
      ball.Pos2D.x = 50;
      ball.Pos2D.y = 200;
      ball.Velocity.x = 30;
      ball.Velocity.y = 40;
    }
  }
});

// ### Paddle component
// Handles paddle input
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TankJS.addComponent("Paddle")

.initFunction(function()
{
  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnMouseMove", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnMouseMove", this);
})

.addFunction("OnMouseMove", function(e)
{
  this.parent.Pos2D.x += e.moveX;
})

.addFunction("OnEnterFrame", function(dt)
{
  if (this.parent.Pos2D.x - 24 < 0)
    this.parent.Pos2D.x = 24
  if (this.parent.Pos2D.x + 24 > 320)
    this.parent.Pos2D.x = 320 - 24;
});

// ### Ball logic
// Handles moving the ball and bouncing off blocks
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TankJS.addComponent("Ball")

.initFunction(function()
{
  // Send out an event that a ball was created
  TankJS.dispatchEvent("OnBallAdded", this.parent);

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  // Send out an event that a ball was destroyed
  TankJS.dispatchEvent("OnBallRemoved", this.parent);

  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  // Collide ball with boundaries
  if (this.parent.Pos2D.x + this.parent.Image.width / 2 > 320 - 16)
  {
    this.parent.Pos2D.x = 320 - 16 - this.parent.Image.width / 2;
    this.parent.Velocity.x *= -1;
  }
  if (this.parent.Pos2D.x - this.parent.Image.width / 2 < 0 + 16)
  {
    this.parent.Pos2D.x = 0 + 16 + this.parent.Image.width / 2;
    this.parent.Velocity.x *= -1;
  }
  if (this.parent.Pos2D.y - this.parent.Image.height / 2 < 0 + 16)
  {
    this.parent.Pos2D.y = 0 + 16 + this.parent.Image.height / 2;
    this.parent.Velocity.y *= -1;
  }

  // Collide ball with paddle
  var paddle = TankJS.getNamedObject("Player");
  if (this.parent.Pos2D.x + this.parent.Image.width / 2 > paddle.Pos2D.x - paddle.Image.width / 2 &&
      this.parent.Pos2D.x - this.parent.Image.width / 2 < paddle.Pos2D.x + paddle.Image.width / 2)
  {
    if (this.parent.Pos2D.y + this.parent.Image.height / 2 > paddle.Pos2D.y - paddle.Image.height / 2 &&
        this.parent.Pos2D.y - this.parent.Image.height / 2 < paddle.Pos2D.y + paddle.Image.height / 2)
    {
      this.parent.Pos2D.y = paddle.Pos2D.y - paddle.Image.height / 2 - this.parent.Image.height / 2;
      this.parent.Velocity.y *= -1;
    }
  }

  // Remove ball if it goes off screen
  if (this.parent.Pos2D.y > 416)
  {
    this.parent.remove();
  }
});
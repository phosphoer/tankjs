function main()
{
  // Create the "engine" object with the main components
  TankJS.addComponents("InputManager, CollisionManager, RenderManager, GameLogic");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  TankJS.RenderManager.context = document.getElementById("screen").getContext("2d");
  TankJS.InputManager.context = document.getElementById("stage");

  // Add background object
  var obj = TankJS.createObject().addComponents("Image").attr("Image",
  {
    imagePath: "res/bg_prerendered.png",
    centered: false
  });
  TankJS.addObject(obj);

  // Add paddle
  var player = TankJS.createObject().addComponents("Image, Paddle, Collider");
  player.Image.imagePath = "res/tiles.png";
  player.Image.subRectOrigin = [0, 64];
  player.Image.subRectCorner = [48, 80];
  player.Image.zdepth = 1;
  player.Collider.width = player.Image.width;
  player.Collider.height = player.Image.height;
  player.Collider.isStatic = true;
  player.Pos2D.x = 160;
  player.Pos2D.y = 376;
  TankJS.addObject(player, "Player");

  // Define a ball prefab so it is easy to quickly spawn them
  TankJS.addPrefab("Ball",
  {
    "Image":
    {
      imagePath: "res/tiles.png",
      subRectOrigin: [48, 64],
      subRectCorner: [64, 80],
      zdepth: 1
    },
    "Ball":
    {},
    "Collider":
    {
      width: 16,
      height: 16
    },
    "Velocity":
    {}
  });

  // Define a red brick prefab
  TankJS.addPrefab("RedBrick",
  {
    "Image":
    {
      imagePath: "res/tiles.png",
      subRectOrigin: [0, 32],
      subRectCorner: [32, 48],
      zdepth: 1
    },
    "Collider":
    {
      width: 32,
      height: 16,
      isStatic: true
    },
    "Brick":
    {}
  });

  // Define a blue brick prefab
  TankJS.addPrefab("BlueBrick",
  {
    "Image":
    {
      imagePath: "res/tiles.png",
      subRectOrigin: [0, 0],
      subRectCorner: [32, 16],
      zdepth: 1
    },
    "Collider":
    {
      width: 32,
      height: 16,
      isStatic: true
    },
    "Brick":
    {}
  });

  // Define a green brick prefab
  TankJS.addPrefab("GreenBrick",
  {
    "Image":
    {
      imagePath: "res/tiles.png",
      subRectOrigin: [0, 48],
      subRectCorner: [32, 64],
      zdepth: 1
    },
    "Collider":
    {
      width: 32,
      height: 16,
      isStatic: true
    },
    "Brick":
    {}
  });

  // Define an orange brick prefab
  TankJS.addPrefab("OrangeBrick",
  {
    "Image":
    {
      imagePath: "res/tiles.png",
      subRectOrigin: [0, 16],
      subRectCorner: [32, 32],
      zdepth: 1
    },
    "Collider":
    {
      width: 32,
      height: 16,
      isStatic: true
    },
    "Brick":
    {}
  });

  // Begin running the engine
  TankJS.start();
}

// ### Game logic component
// Manages general state of the game
TankJS.registerComponent("GameLogic")

.initialize(function ()
{
  // Keep track of how many balls and bricks exist
  this.numBalls = 0;
  this.numBricks = 0;

  // Keep track of current level
  this.level = -1;

  // Keep track of player lives
  this.lives = 3;

  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnBallAdded", this);
  TankJS.addEventListener("OnBallRemoved", this);
  TankJS.addEventListener("OnBrickAdded", this);
  TankJS.addEventListener("OnBrickRemoved", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnBallAdded", this);
  TankJS.removeEventListener("OnBallRemoved", this);
  TankJS.removeEventListener("OnBrickAdded", this);
  TankJS.removeEventListener("OnBrickRemoved", this);
})

.addFunction("OnBallAdded", function ()
{
  ++this.numBalls;
})

.addFunction("OnBallRemoved", function ()
{
  --this.numBalls;
})

.addFunction("OnBrickAdded", function ()
{
  ++this.numBricks;
})

.addFunction("OnBrickRemoved", function ()
{
  --this.numBricks;
})

.addFunction("OnEnterFrame", function (dt)
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
      var ball = TankJS.createObjectFromPrefab("Ball");
      ball.Pos2D.x = 50;
      ball.Pos2D.y = 200;
      TankJS.addObject(ball);
      TankJS.dispatchEvent("OnLevelStart");
    }
  }

  // If no bricks exist, build the next level
  if (this.numBricks === 0)
  {
    ++this.lives;
    ++this.level;
    TankJS.dispatchEvent("OnLevelComplete");

    if (this.level === Breakout.levels.length)
    {}
    else
    {
      var data = Breakout.levels[this.level];
      for (var row in data.bricks)
      {
        for (var col in data.bricks[row])
        {
          var brickType = data.bricks[row][col];
          if (!brickType)
            continue;

          var brick = TankJS.createObjectFromPrefab(brickType + "Brick");
          brick.Pos2D.x = 64 + col * brick.Image.width;
          brick.Pos2D.y = 64 + row * brick.Image.height;
          TankJS.addObject(brick);
        }
      }
    }
  }
});

// ### Paddle component
// Handles paddle input
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TankJS.registerComponent("Paddle")

.initialize(function ()
{
  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnMouseMove", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnMouseMove", this);
})

.addFunction("OnMouseMove", function (e)
{
  this.parent.Pos2D.x += e.moveX;
})

.addFunction("OnEnterFrame", function (dt)
{
  this.parent.Pos2D.x = TankJS.InputManager.mousePos[0];
  if (this.parent.Pos2D.x - 24 < 0)
    this.parent.Pos2D.x = 24
  if (this.parent.Pos2D.x + 24 > 320)
    this.parent.Pos2D.x = 320 - 24;
});

// ### Ball logic
// Handles moving the ball and bouncing off blocks
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TankJS.registerComponent("Ball")

.initialize(function ()
{
  // Send out an event that a ball was created
  TankJS.dispatchEvent("OnBallAdded", this.parent);

  TankJS.addEventListener("OnEnterFrame", this);
  TankJS.addEventListener("OnLevelComplete", this);
  TankJS.addEventListener("OnLevelStart", this);
})

.destruct(function ()
{
  // Send out an event that a ball was destroyed
  TankJS.dispatchEvent("OnBallRemoved", this.parent);

  TankJS.removeEventListener("OnEnterFrame", this);
  TankJS.removeEventListener("OnLevelComplete", this);
  TankJS.removeEventListener("OnLevelStart", this);
})

.addFunction("OnCollide", function (other)
{
  var centerA = [this.parent.Pos2D.x, this.parent.Pos2D.y];
  var centerB = [other.Pos2D.x, other.Pos2D.y];
  var halfSizeA = [this.parent.Collider.width / 2, this.parent.Collider.height / 2];
  var halfSizeB = [other.Collider.width / 2, other.Collider.height / 2];

  // Bounce off player
  if (other.Paddle)
  {
    this.parent.Velocity.x = ((centerA[0] - centerB[0]) / halfSizeB[0]) * 30;
    this.parent.Velocity.y *= -1;
  }

  if (other.Brick)
  {
    var pen = [0, 0];
    if (centerA[0] < centerB[0])
      pen[0] = (centerA[0] + halfSizeA[0]) - (centerB[0] - halfSizeB[0]);
    else
      pen[0] = (centerA[0] - halfSizeA[0]) - (centerB[0] + halfSizeB[0]);

    if (centerA[1] < centerB[1])
      pen[1] = (centerA[1] + halfSizeA[1]) - (centerB[1] - halfSizeB[1]);
    else
      pen[1] = (centerA[1] - halfSizeA[1]) - (centerB[1] + halfSizeB[1]);

    if (Math.abs(pen[0]) < Math.abs(pen[1]))
    {
      this.parent.Velocity.x *= -1;
    }
    else
    {
      this.parent.Velocity.y *= -1;
    }

    other.remove();
  }
})

.addFunction("OnLevelComplete", function ()
{
  this.parent.remove();
})

.addFunction("OnLevelStart", function ()
{
  this.parent.Velocity.x = 30;
  this.parent.Velocity.y = 40;
})

.addFunction("OnEnterFrame", function (dt)
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

  // Remove ball if it goes off screen
  if (this.parent.Pos2D.y > 416)
  {
    this.parent.remove();
  }
});

// ### Brick component
// Handles brick logic
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TankJS.registerComponent("Brick")

.initialize(function ()
{
  TankJS.dispatchEvent("OnBrickAdded", this);
})

.destruct(function ()
{
  TankJS.dispatchEvent("OnBrickRemoved", this);
})

.addFunction("OnEnterFrame", function (dt) {});
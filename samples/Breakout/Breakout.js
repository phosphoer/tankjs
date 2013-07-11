function main()
{
  // Create the "engine" object with the main components
  // var gameSpace = TANK.createSpace("InputManager, GameLogic, CollisionManager, RenderManager");
  // var uiSpace = TANK.createSpace("InputManager, RenderManager");
  // TANK.addSpace(gameSpace, "Game");
  // TANK.addSpace(uiSpace, "UI");
  TANK.addComponents("InputManager, GameLogic, CollisionManager, RenderManager");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  TANK.RenderManager.context = document.getElementById("screen").getContext("2d");
  TANK.InputManager.context = document.getElementById("stage");

  // Add background object
  var background = TANK.createEntity("Image");
  background.Image.imagePath = "res/bg_prerendered.png";
  background.Image.centered = false;
  TANK.addEntity(background);

  // Add paddle
  var player = TANK.createEntity("Image, Paddle, Collider");
  player.Image.imagePath = "res/tiles.png";
  player.Image.subRectOrigin = [0, 64];
  player.Image.subRectCorner = [48, 80];
  player.Image.zdepth = 1;
  player.Collider.width = player.Image.width;
  player.Collider.height = player.Image.height;
  player.Collider.isStatic = true;
  player.Pos2D.x = 160;
  player.Pos2D.y = 376;
  TANK.addEntity(player, "Player");

  // Begin running the engine
  TANK.start();
}

// ### Game logic component
// Manages general state of the game
TANK.registerComponent("GameLogic")

.construct(function ()
{
  // Keep track of how many balls and bricks exist
  this.numBalls = 0;
  this.numBricks = 0;

  // Keep track of current level
  this.level = 0;

  // Keep track of player lives
  this.lives = 3;
})

.initialize(function ()
{
  this.OnBallAdded = function ()
  {
    ++this.numBalls;
  };

  this.OnBallRemoved = function ()
  {
    --this.numBalls;
  };

  this.OnBrickAdded = function ()
  {
    ++this.numBricks;
  };

  this.OnBrickRemoved = function ()
  {
    --this.numBricks;
  };

  this.OnEnterFrame = function (dt)
  {
    // If no balls exist, spawn a new one and decrement lives
    if (this.numBalls === 0)
    {
      --this.lives;
      if (this.lives === 0)
        TANK.reset(main);
      else
      {
        // Create a new ball
        var ball = TANK.createEntityFromPrefab("Ball");
        ball.Pos2D.x = 50;
        ball.Pos2D.y = 200;
        TANK.addEntity(ball);
        TANK.dispatchEvent("OnLevelContinue");
      }
    }

    // If no bricks exist, build the next level
    if (this.numBricks === 0)
    {
      ++this.lives;
      ++this.level;
      TANK.dispatchEvent("OnLevelComplete");

      if (this.level === Breakout.levels.length)
      {}
      else
      {
        this.buildLevel();
      }
    }
  };

  this.buildLevel = function ()
  {
    var data = Breakout.levels[this.level];
    for (var row in data.bricks)
    {
      for (var col in data.bricks[row])
      {
        var brickType = data.bricks[row][col];
        if (!brickType)
          continue;

        var brick = TANK.createEntityFromPrefab(brickType + "Brick");
        brick.Pos2D.x = 64 + col * brick.Sprite.width;
        brick.Pos2D.y = 64 + row * brick.Sprite.height;
        TANK.addEntity(brick);
      }
    }
  };

  this.OnLevelContinue = function ()
  {
    var counter = TANK.createEntityFromPrefab("CountDown");
    counter.Pos2D.x = 150;
    counter.Pos2D.y = 200;
    counter.Sprite.playing = true;
    TANK.addEntity(counter);
    counter.Sprite.OnAnimationComplete = function ()
    {
      this.space.removeEntity(this.parent);
      TANK.dispatchEvent("OnCountdownFinished");
    };
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
  this.addEventListener("OnBallAdded", this.OnBallAdded);
  this.addEventListener("OnBallRemoved", this.OnBallRemoved);
  this.addEventListener("OnBrickAdded", this.OnBrickAdded);
  this.addEventListener("OnBrickRemoved", this.OnBrickRemoved);
  this.addEventListener("OnLevelContinue", this.OnLevelContinue);

  this.buildLevel();
})


// ### Paddle component
// Handles paddle input
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TANK.registerComponent("Paddle")

.initialize(function ()
{
  this.OnMouseMove = function (e)
  {
    this.parent.Pos2D.x += e.moveX;
  };

  this.OnEnterFrame = function (dt)
  {
    this.parent.Pos2D.x = TANK.InputManager.mousePos[0];
    if (this.parent.Pos2D.x - 24 < 0)
      this.parent.Pos2D.x = 24
    if (this.parent.Pos2D.x + 24 > 320)
      this.parent.Pos2D.x = 320 - 24;
  };

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
  this.addEventListener("OnMouseMove", this.OnMouseMove);
})


// ### Ball logic
// Handles moving the ball and bouncing off blocks
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TANK.registerComponent("Ball")

.initialize(function ()
{
  this.OnCollide = function (other)
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

      other.Sprite.playing = true;
    }
  };

  this.OnLevelComplete = function ()
  {
    TANK.removeEntity(this.parent);
  };

  this.OnCountdownFinished = function ()
  {
    this.parent.Velocity.x = 80;
    this.parent.Velocity.y = 100;
  };

  this.OnEnterFrame = function (dt)
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
      TANK.removeEntity(this.parent);
    }
  };

  // Send out an event that a ball was created
  TANK.dispatchEvent("OnBallAdded", this.parent);

  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
  this.addEventListener("OnLevelComplete", this.OnLevelComplete);
  this.addEventListener("OnCountdownFinished", this.OnCountdownFinished);
})

.destruct(function ()
{
  // Send out an event that a ball was destroyed
  TANK.dispatchEvent("OnBallRemoved", this.parent);
})


// ### Brick component
// Handles brick logic
// Could be just implemented in the game logic component but I
// wanted to demonstrate using components for smaller tasks
TANK.registerComponent("Brick")

.initialize(function ()
{
  this.OnAnimationComplete = function ()
  {
    this.space.removeEntity(this.parent);
  };

  TANK.dispatchEvent("OnBrickAdded", this);
})

.destruct(function ()
{
  TANK.dispatchEvent("OnBrickRemoved", this);
});

// Define a ball prefab so it is easy to quickly spawn them
TANK.addPrefab("Ball", function ()
{
  var e = TANK.createEntity("Image, Ball, Collider, Velocity");
  e.Image.imagePath = "res/tiles.png";
  e.Image.subRectOrigin = [48, 64];
  e.Image.subRectCorner = [64, 80];
  e.Image.zdepth = 1;
  e.Collider.width = 16;
  e.Collider.height = 16;
  return e;
});

// Define a red brick prefab
TANK.addPrefab("RedBrick", function ()
{
  var e = TANK.createEntity("Sprite, Collider, Brick");
  e.Sprite.playing = false;
  e.Sprite.imagePath = "res/tiles.png";
  e.Sprite.frames = [
    {
      duration: 0.1,
      rectOrigin: [0, 0 + 32],
      rectCorner: [32, 16 + 32]
    },
    {
      duration: 0.5,
      rectOrigin: [32, 0 + 32],
      rectCorner: [64, 16 + 32]
    },
    {
      duration: 0.5,
      rectOrigin: [64, 0 + 32],
      rectCorner: [96, 16 + 32]
    },
    {
      duration: 0.5,
      rectOrigin: [96, 0 + 32],
      rectCorner: [128, 16 + 32]
    }
  ];
  e.Sprite.zdepth = 1;

  e.Collider.width = 32;
  e.Collider.height = 16;
  e.Collider.isStatic = true;
  return e;
});

// Define a blue brick prefab
TANK.addPrefab("BlueBrick", function ()
{
  var e = TANK.createEntity("Sprite, Collider, Brick");
  e.Sprite.playing = false;
  e.Sprite.imagePath = "res/tiles.png";
  e.Sprite.frames = [
    {
      duration: 0.1,
      rectOrigin: [0, 0],
      rectCorner: [32, 16]
    },
    {
      duration: 0.5,
      rectOrigin: [32, 0],
      rectCorner: [64, 16]
    },
    {
      duration: 0.5,
      rectOrigin: [64, 0],
      rectCorner: [96, 16]
    },
    {
      duration: 0.5,
      rectOrigin: [96, 0],
      rectCorner: [128, 16]
    }
  ];
  e.Sprite.zdepth = 1;
  e.Collider.width = 32;
  e.Collider.height = 16;
  e.Collider.isStatic = true;
  return e;
});

// Define a green brick prefab
TANK.addPrefab("GreenBrick", function ()
{
  var e = TANK.createEntity("Sprite, Collider, Brick");
  e.Sprite.playing = false;
  e.Sprite.imagePath = "res/tiles.png";
  e.Sprite.frames = [
    {
      duration: 0.1,
      rectOrigin: [0, 0 + 48],
      rectCorner: [32, 16 + 48]
    },
    {
      duration: 0.5,
      rectOrigin: [32, 0 + 48],
      rectCorner: [64, 16 + 48]
    },
    {
      duration: 0.5,
      rectOrigin: [64, 0 + 48],
      rectCorner: [96, 16 + 48]
    },
    {
      duration: 0.5,
      rectOrigin: [96, 0 + 48],
      rectCorner: [128, 16 + 48]
    }
  ];
  e.Sprite.zdepth = 1;
  e.Collider.width = 32;
  e.Collider.height = 16;
  e.Collider.isStatic = true;
  return e;
});

// Define an orange brick prefab
TANK.addPrefab("OrangeBrick", function ()
{
  var e = TANK.createEntity("Sprite, Collider, Brick");
  e.Sprite.playing = false;
  e.Sprite.imagePath = "res/tiles.png";
  e.Sprite.frames = [
    {
      duration: 0.1,
      rectOrigin: [0, 0 + 16],
      rectCorner: [32, 16 + 16]
    },
    {
      duration: 0.5,
      rectOrigin: [32, 0 + 16],
      rectCorner: [64, 16 + 16]
    },
    {
      duration: 0.5,
      rectOrigin: [64, 0 + 16],
      rectCorner: [96, 16 + 16]
    },
    {
      duration: 0.5,
      rectOrigin: [96, 0 + 16],
      rectCorner: [128, 16 + 16]
    }
  ];
  e.Sprite.zdepth = 1;
  e.Collider.width = 32;
  e.Collider.height = 16;
  e.Collider.isStatic = true;
  return e;
});

// Define prefab for timer
TANK.addPrefab("CountDown", function ()
{
  var e = TANK.createEntity("Sprite, Collider");
  e.Sprite.playing = false;
  e.Sprite.imagePath = "res/tiles.png";
  e.Sprite.frames = [
    {
      duration: 1,
      rectOrigin: [0, 96],
      rectCorner: [32, 144]
    },
    {
      duration: 1,
      rectOrigin: [32, 96],
      rectCorner: [64, 144]
    },
    {
      duration: 1,
      rectOrigin: [64, 96],
      rectCorner: [96, 144]
    }
  ];
  e.Sprite.zdepth = 5;
  return e;
});
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
    "InvokeOnCollide":
    {
      invokeOther: "TakeDamage",
      argOther: 1
    }
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
  var player = TANK.createEntity()
    .addComponents("Text, Image, TopDownMovement, RotateController, ObjectSpawner, Collider, Health, CustomUpdate")
    .attr("Pos2D",
  {
    x: 150,
    y: 100
  })
    .attr("Image",
  {
    imagePath: "res/BlueBall.png"
  })
    .attr("Health",
  {
    max: 20,
    value: 20
  })
    .attr("Text",
  {
    color: "#000",
    zdepth: 1,
    offsetX: -5,
    offsetY: 4
  })
    .attr("ObjectSpawner",
  {
    objectPrefab: "Bullet",
    triggerKey: TANK.SPACE
  })
    .attr("CustomUpdate",
  {
    func: function (dt)
    {
      this.Text.text = this.Health.value;
    }
  });
  TANK.addEntity(player, "Player");

  // Create AI object
  var ai = TANK.createEntity()
    .addComponents("Text, Image, KlangAI, ObjectSpawner, Collider, Health, CustomUpdate")
    .attr("Pos2D",
  {
    x: 450,
    y: 400
  })
    .attr("Image",
  {
    imagePath: "res/RedBall.png"
  })
    .attr("Health",
  {
    max: 20,
    value: 20
  })
    .attr("Text",
  {
    color: "#000",
    zdepth: 1,
    offsetX: -5,
    offsetY: 4
  })
    .attr("ObjectSpawner",
  {
    objectPrefab: "Bullet"
  })
    .attr("CustomUpdate",
  {
    func: function (dt)
    {
      this.Text.text = this.Health.value;
    }
  });
  TANK.addEntity(ai, "AI");

  // Create walls around edges
  var obj;
  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 / 2,
    y: -25
  }).attr("Collider",
  {
    isStatic: true,
    width: 640
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 / 2,
    y: 480 + 25
  }).attr("Collider",
  {
    isStatic: true,
    width: 640
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: -25,
    y: 480 / 2
  }).attr("Collider",
  {
    isStatic: true,
    height: 480
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 + 25,
    y: 480 / 2
  }).attr("Collider",
  {
    isStatic: true,
    height: 480
  });
  TANK.addEntity(obj);


  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 100,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 150,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 200,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 200,
    y: 100
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 400,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 450,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 500,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  obj = TANK.createEntity().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 500,
    y: 400
  }).attr("Collider",
  {
    isStatic: true
  });
  TANK.addEntity(obj);

  TANK.start();
}

// Custom game logic component to manage general state of game
TANK.registerComponent("GameLogic")

.initialize(function ()
{
  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  if (!TANK.getNamedEntity("Player") || !TANK.getNamedEntity("AI"))
  {
    TANK.reset();
  }
});

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

  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  this._rotateTimer -= dt;

  var player = TANK.getNamedEntity("Player");
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
});
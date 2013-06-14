function main()
{
  // Create the "engine" object with the main components
  var e = TankJS.createObject().addComponents("InputManager, CollisionManager, RenderManager, GameLogic");
  TankJS.addObject(e, "Engine");

  // Point the render manager's context to the canvas one
  // Would be nice not to require this somehow?
  e.RenderManager.context = document.getElementById("screen").getContext("2d");
  e.InputManager.context = document.getElementById("stage");

  // Create a bullet object prefab
  TankJS.addPrefab("Bullet",
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
  var bg = TankJS.createObject().addComponents("ColoredBox");
  bg.ColoredBox.width = 640;
  bg.ColoredBox.height = 480;
  bg.ColoredBox.color = "#fff";
  bg.ColoredBox.zdepth = -1;
  bg.ColoredBox.centered = false;
  TankJS.addObject(bg);

  // Create a player object
  var player = TankJS.createObject()
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
    triggerKey: TankJS.SPACE
  })
    .attr("CustomUpdate",
  {
    func: function (dt)
    {
      this.Text.text = this.Health.value;
    }
  });
  TankJS.addObject(player, "Player");

  // Create AI object
  var ai = TankJS.createObject()
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
  TankJS.addObject(ai, "AI");

  // Create walls around edges
  var obj;
  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 / 2,
    y: -25
  }).attr("Collider",
  {
    isStatic: true,
    width: 640
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 / 2,
    y: 480 + 25
  }).attr("Collider",
  {
    isStatic: true,
    width: 640
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: -25,
    y: 480 / 2
  }).attr("Collider",
  {
    isStatic: true,
    height: 480
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 640 + 25,
    y: 480 / 2
  }).attr("Collider",
  {
    isStatic: true,
    height: 480
  });
  TankJS.addObject(obj);


  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 100,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 150,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 200,
    y: 150
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 200,
    y: 100
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 400,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 450,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 500,
    y: 350
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  obj = TankJS.createObject().addComponents("ColoredBox, Collider").attr("Pos2D",
  {
    x: 500,
    y: 400
  }).attr("Collider",
  {
    isStatic: true
  });
  TankJS.addObject(obj);

  TankJS.start();
}

// Custom game logic component to manage general state of game
TankJS.addComponent("GameLogic")

.initialize(function ()
{
  TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  if (!TankJS.getNamedObject("Player") || !TankJS.getNamedObject("AI"))
  {
    TankJS.reset();
  }
});

// Custom component to implement AI for the other player
TankJS.addComponent("KlangAI")

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

  TankJS.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function (dt)
{
  this._rotateTimer -= dt;

  var player = TankJS.getNamedObject("Player");
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
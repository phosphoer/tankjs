(function ()
{
  TANK.registerComponent("TopDownMovement")

  .requires("Pos2D")

  .construct(function ()
  {
    this.left = false;
    this.up = false;
    this.right = false;
    this.down = false;
    this.movementSpeed = 150;
  })

  .initialize(function ()
  {
    this.OnKeyPress = OnKeyPress;
    this.OnKeyRelease = OnKeyRelease;
    this.OnEnterFrame = OnEnterFrame;

    this.addEventListener("OnKeyPress", this.OnKeyPress);
    this.addEventListener("OnKeyRelease", this.OnKeyRelease);
    this.addEventListener("OnEnterFrame", this.OnEnterFrame);
  })

  .destruct(function ()
  {
    this.removeEventListener("OnKeyPress", this.OnKeyPress);
    this.removeEventListener("OnKeyRelease", this.OnKeyRelease);
    this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
  });

  function OnKeyPress(key)
  {
    if (key == TANK.Key.W)
      this.up = true;
    else if (key == TANK.Key.A)
      this.left = true;
    else if (key == TANK.Key.S)
      this.down = true;
    else if (key == TANK.Key.D)
      this.right = true;
  };

  function OnKeyRelease(key)
  {
    if (key == TANK.Key.W)
      this.up = false;
    else if (key == TANK.Key.A)
      this.left = false;
    else if (key == TANK.Key.S)
      this.down = false;
    else if (key == TANK.Key.D)
      this.right = false;
  };

  function OnEnterFrame(dt)
  {
    var t = this.parent.Pos2D;
    if (this.left)
      t.x -= this.movementSpeed * dt;
    if (this.up)
      t.y -= this.movementSpeed * dt;
    if (this.right)
      t.x += this.movementSpeed * dt;
    if (this.down)
      t.y += this.movementSpeed * dt;
  };

}());
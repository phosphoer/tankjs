TANK.registerComponent("ObjectSpawner")

.requires("Pos2D")

.construct(function ()
{
  this.objectPrefab = "";
  this.spawnDelay = 0.5;
  this.spawnVelocity = 100;
  this.spawnDistance = 40;
  this.triggerKey = null;

  this._spawnTimer = 0;
})

.initialize(function ()
{
  this.OnKeyPress = function (key)
  {
    if (this.triggerKey === null)
      return;

    if (key == this.triggerKey)
    {
      this.spawn();
    }
  };

  this.OnEnterFrame = function (dt)
  {
    this._spawnTimer += dt;
  };

  this.spawn = function (dt)
  {
    if (this._spawnTimer >= this.spawnDelay)
    {
      var t = this.parent.Pos2D;
      var obj = TANK.createEntityFromPrefab(this.objectPrefab);
      obj.Pos2D.x = t.x + Math.cos(t.rotation) * this.spawnDistance;
      obj.Pos2D.y = t.y + Math.sin(t.rotation) * this.spawnDistance;
      obj.Velocity.x = Math.cos(t.rotation) * this.spawnVelocity,
      obj.Velocity.y = Math.sin(t.rotation) * this.spawnVelocity
      this._spawnTimer = 0;
      TANK.addEntity(obj);
    }
  };

  this.addEventListener("OnKeyPress", this.OnKeyPress);
  this.addEventListener("OnEnterFrame", this.OnEnterFrame);
})

.destruct(function ()
{
  this.removeEventListener("OnKeyPress", this.OnKeyPress);
  this.removeEventListener("OnEnterFrame", this.OnEnterFrame);
})
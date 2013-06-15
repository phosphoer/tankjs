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
  TANK.addEventListener("OnKeyPress", this);
  TANK.addEventListener("OnEnterFrame", this);
})

.destruct(function ()
{
  TANK.removeEventListener("OnKeyPress", this);
  TANK.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnKeyPress", function (key)
{
  if (this.triggerKey === null)
    return;

  if (key == this.triggerKey)
  {
    this.spawn();
  }
})

.addFunction("OnEnterFrame", function (dt)
{
  this._spawnTimer += dt;
})

.addFunction("spawn", function (dt)
{
  if (this._spawnTimer >= this.spawnDelay)
  {
    var t = this.parent.Pos2D;
    var obj = TANK.createObjectFromPrefab(this.objectPrefab);
    obj.attr("Pos2D",
    {
      x: t.x + Math.cos(t.rotation) * this.spawnDistance,
      y: t.y + Math.sin(t.rotation) * this.spawnDistance
    });
    obj.attr("Velocity",
    {
      x: Math.cos(t.rotation) * this.spawnVelocity,
      y: Math.sin(t.rotation) * this.spawnVelocity
    });
    this._spawnTimer = 0;
    TANK.addEntity(obj);
  }
});
TankJS.addComponent("ObjectSpawner")

.includes("2D")

.initFunction(function()
{
  this.objectPrefab = "";
  this.spawnDelay = 0.5;
  this.spawnVelocity = 100;
  this.spawnDistance = 40;
  this.triggerKey = null;

  this._spawnTimer = 0;
  TankJS.addEventListener("OnKeyPressed", this);
  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnKeyPressed", this);
  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnKeyPressed", function(key)
{
  if (this.triggerKey === null)
    return;

  if (key == this.triggerKey)
  {
    this.spawn();
  }
})

.addFunction("OnEnterFrame", function(dt)
{
  this._spawnTimer += dt;
})

.addFunction("spawn", function(dt)
{
  if (this._spawnTimer >= this.spawnDelay)
  {
    var t = this.parent.getComponent("2D");
    var obj = TankJS.addObjectFromPrefab(this.objectPrefab);
    obj.attr("2D", {x: t.x + Math.cos(t.rotation) * this.spawnDistance, y: t.y + Math.sin(t.rotation) * this.spawnDistance});
    obj.attr("Velocity", {x: Math.cos(t.rotation) * this.spawnVelocity, y: Math.sin(t.rotation) * this.spawnVelocity});
    this._spawnTimer = 0;
  }
});
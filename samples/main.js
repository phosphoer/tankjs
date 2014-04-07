"use strict";

function main()
{
  TANK.createEngine(["EnemySpawner", "Input", "Renderer2D"]);
  TANK.main.Renderer2D.context = document.querySelector("#canvas").getContext("2d");
  TANK.main.Renderer2D.camera.y = -200;
  TANK.start();

  var e = new TANK.Entity("Player");
  TANK.main.addChild(e);

  e = new TANK.Entity("Ground");
  TANK.main.addChild(e, "Level");
}

TANK.registerComponent("EnemySpawner")
.construct(function()
{
  this.spawnTimer = 5;
})
.initialize(function()
{
  this.update = function(dt)
  {
    this.spawnTimer -= dt;

    if (this.spawnTimer <= 0)
    {
      var e = new TANK.Entity("Enemy");
      e.Pos2D.x = TANK.main.Renderer2D.camera.x + window.innerWidth / 2;
      e.Pos2D.y = -250 - Math.random() * 200;
      TANK.main.addChild(e);
      this.spawnTimer = 3 + Math.random() * 5;
    }
  };
});
"use strict";

function main()
{
  TANK.createEngine(["Input", "Renderer2D"]);
  TANK.main.Renderer2D.context = document.querySelector("#canvas").getContext("2d");
  TANK.main.Renderer2D.camera.y = -200;
  TANK.start();

  var e = new TANK.Entity("Player");
  e.Image.image.src = "space-tank.png";
  e.Image.scale = 5;
  TANK.main.addChild(e);

  e = new TANK.Entity("Ground");
  TANK.main.addChild(e, "Level");
}


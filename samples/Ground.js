(function()
{
  "use strict";

  TANK.registerComponent("Ground")
  .construct(function()
  {
    this.heightMap = [];
    this.currentHeight = 0;
    this.currentPos = 0;
  })
  .initialize(function()
  {
    TANK.main.Renderer2D.add(this);

    this.addPoint = function()
    {
      var point = {x: this.currentPos, y: this.currentHeight};
      this.currentHeight += -20 + Math.random() * 40;
      this.currentPos += 100;
      this.heightMap.push(point);
    };

    this.getHeight = function(x)
    {
      for (var i = 0; i < this.heightMap.length - 1; ++i)
      {
        var p1 = this.heightMap[i];
        var p2 = this.heightMap[i + 1];

        if (x >= p1.x && x < p2.x)
        {
          var m = (p2.y - p1.y) / (p2.x - p1.x);
          var b = p2.y - m * p2.x;
          var y = m * x + b;
          return y;
        }
      }

      console.error("huh?");
      return 0;
    };

    this.getAngle = function(x)
    {
      for (var i = 0; i < this.heightMap.length - 1; ++i)
      {
        var p1 = this.heightMap[i];
        var p2 = this.heightMap[i + 1];

        if (x >= p1.x && x < p2.x)
          return Math.atan2(p2.y - p1.y, p2.x - p1.x);
      }

      console.error("huh?");
      return 0;
    };

    this.addPoint();

    this.draw = function(ctx, camera)
    {
      while (camera.x + window.innerWidth / 2 >= this.heightMap[this.heightMap.length - 1].x)
        this.addPoint();

      ctx.save();
      ctx.translate(-camera.x, -camera.y);
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (var i = 0; i < this.heightMap.length; ++i)
      {
        var p = this.heightMap[i];
        ctx.lineTo(p.x, p.y);
      }
      ctx.lineTo(this.heightMap[this.heightMap.length - 1].x, window.innerHeight);
      ctx.lineTo(0, window.innerHeight);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    };
  });

})();
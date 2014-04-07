(function()
{
  "use strict";

  // Register the ground component, which has
  // no other component dependencies
  TANK.registerComponent("Ground")
  .construct(function()
  {
    // Components which add themselves to the renderer
    // must define a zdepth, larger values are closer to camera
    this.zdepth = 1;
    this.heightMap = [];
    this.currentHeight = 0;
    this.currentPos = 0;
  })
  .initialize(function()
  {
    // Add ourseles to renderer to perform custom drawing
    TANK.main.Renderer2D.add(this);

    // Function to add a height point on the terrain
    this.addPoint = function()
    {
      var point = {x: this.currentPos, y: this.currentHeight};
      this.currentHeight += -20 + Math.random() * 40;
      this.currentPos += 100;
      this.heightMap.push(point);
    };

    // Function to get the height of the terrain at a particular x coord
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

      console.error("somehow you are outside the heightmap");
      return 0;
    };

    // Function to get the angle of the terrain at a particular x coord
    this.getAngle = function(x)
    {
      for (var i = 0; i < this.heightMap.length - 1; ++i)
      {
        var p1 = this.heightMap[i];
        var p2 = this.heightMap[i + 1];

        if (x >= p1.x && x < p2.x)
          return Math.atan2(p2.y - p1.y, p2.x - p1.x);
      }

      console.error("somehow you are outside the heightmap");
      return 0;
    };

    // Add one starter point so I don't have to do checks
    this.addPoint();

    // The renderer will call draw on this component every frame
    // since I added this component as a drawable
    this.draw = function(ctx, camera)
    {
      // Hijacking the draw loop to build our terrain
      // Usually bad form but in this case it doesn't really matter
      while (camera.x + window.innerWidth / 2 >= this.heightMap[this.heightMap.length - 1].x)
        this.addPoint();

      // Draw the custom terrain with some line drawing
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
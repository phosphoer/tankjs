function main()
{
  TankJS.addComponent("Sprite")
        .initFunction(function()
        {
          console.log(this.name + " initialized in " + this.parent.name);
          TankJS.addEventListener("TestEvent", this.myFunction, this);
        });

  TankJS.addComponent("Canvas")
        .initFunction(function()
        {
          console.log(this.name + " initialized in " + this.parent.name);

          this.canvas = document.createElement("canvas");
          this.canvas.width = 640;
          this.canvas.height = 480;

          addProperty(this, "width",
            function()
            {
              return this.canvas.width;
            },
            function(val)
            {
              this.canvas.width = val;
            });

          addProperty(this, "height",
            function()
            {
              return this.canvas.height;
            },
            function(val)
            {
              this.canvas.height = val;
            });

          document.body.appendChild(this.canvas);
        })
        .uninitFunction(function()
        {
          console.log(this.name + " uninitialized in " + this.parent.name);

          document.removeChild(this.canvas);
          this.canvas = null;
        });

  TankJS.addObject("Canvas").addComponents("Canvas").attr("Canvas", {width: 800, height: 600});
}
TankJS.addComponent("Canvas")

.initFunction(function()
{
  this.canvas = document.createElement("canvas");
  this.canvas.width = 640;
  this.canvas.height = 480;
  this.context = this.canvas.getContext("2d");
  document.body.appendChild(this.canvas);

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

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  TankJS.removeEventListener("OnEnterFrame", this);

  document.body.removeChild(this.canvas);
  this.canvas = null;
})

.addFunction("OnEnterFrame", function(dt)
{
  this.context.fillStyle = "#fff";
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
});
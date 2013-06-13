TankJS.addComponent("InputManager")

.initFunction(function()
{
  var that = this;

  // ### Mouse position
  // Stored as an array [x, y]
  this.mousePos = [0, 0];

  // ### Input UI element
  // Defines which HTML element mouse input is relative to
  // If left null mouse input will be relative to window
  addProperty(this, "context",
    function()
    {
      return that._context;
    },
    function(val)
    {
      if (that._context)
        that.context.removeEventListener("mousemove", that.mousemove);
      else
        removeEventListener("mousemove", that.mousemove);

      that._context = val;
      if (that._context)
        that.context.addEventListener("mousemove", that.mousemove);
      else
        addEventListener("mousemove", that.mousemove);
    });

  this._context = null;
  this._keyDownEvents = [];
  this._keyUpEvents = [];
  this._keysHeld = {};

  var that = this;
  this.keydown = function(e)
  {
    if (!that._keysHeld[e.keyCode])
      that._keyDownEvents.push(e);
  };

  this.keyup = function(e)
  {
    if (that._keysHeld[e.keyCode])
      that._keyUpEvents.push(e);
  };

  this.mousemove = function(e)
  {
    that.mousePos = [e.x, e.y];
    if (that._context)
    {
      that.mousePos[0] -= that._context.offsetLeft;
      that.mousePos[1] -= that._context.offsetTop;
    }
  }

  addEventListener("keydown", this.keydown);
  addEventListener("keyup", this.keyup);
  if (this.context)
    this.context.addEventListener("mousemove", this.mousemove);
  else
    addEventListener("mousemove", this.mousemove);

  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  removeEventListener("keydown", this.keydown);
  removeEventListener("keyup", this.keyup);
  if (this.context)
    this.context.removeEventListener("mousemove", this.mousemove);
  else
    removeEventListener("mousemove", this.mousemove);

  TankJS.removeEventListener("OnEnterFrame", this);
})

.addFunction("OnEnterFrame", function(dt)
{
  var e;
  for (var i in this._keyDownEvents)
  {
    e = this._keyDownEvents[i];
    TankJS.dispatchEvent("OnKeyPressed", e.keyCode, this._keysHeld);
    this._keysHeld[e.keyCode] = true;
  }
  this._keyDownEvents = [];

  for (var i in this._keysHeld)
  {
    TankJS.dispatchEvent("OnKeyHeld", i);
  }

  for (var i in this._keyUpEvents)
  {
    e = this._keyUpEvents[i];
    TankJS.dispatchEvent("OnKeyReleased", e.keyCode, this._keysHeld);
    delete this._keysHeld[e.keyCode];
  }
  this._keyUpEvents = [];
});
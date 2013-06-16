TANK.registerComponent("InputManager")

.construct(function ()
{
  var that = this;

  // ### Mouse position
  // Stored as an array [x, y]
  this.mousePos = [0, 0];
  this.lastMousePos = [0, 0];

  // ### Mouse movement
  // The last delta the mouse had
  // Stored as array [x, y]
  this.mouseDelta = [0, 0];

  // ### Input UI element
  // Defines which HTML element mouse input is relative to
  // If left null mouse input will be relative to window
  addProperty(this, "context", function ()
  {
    return that._context;
  }, function (val)
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
  this._mouseMoveEvents = []
  this._keysHeld = {};

  var that = this;
  this.keydown = function (e)
  {
    if (!that._keysHeld[e.keyCode])
      that._keyDownEvents.push(e);
  };

  this.keyup = function (e)
  {
    if (that._keysHeld[e.keyCode])
      that._keyUpEvents.push(e);
  };

  this.mousemove = function (e)
  {
    that._mouseMoveEvents.push(e);
  }

  addEventListener("keydown", this.keydown);
  addEventListener("keyup", this.keyup);
  if (this.context)
    this.context.addEventListener("mousemove", this.mousemove);
  else
    addEventListener("mousemove", this.mousemove);

  this.addEventListener("OnEnterFrame", onEnterFrame);
})

.destruct(function ()
{
  removeEventListener("keydown", this.keydown);
  removeEventListener("keyup", this.keyup);
  if (this.context)
    this.context.removeEventListener("mousemove", this.mousemove);
  else
    removeEventListener("mousemove", this.mousemove);

  TANK.removeEventListener("OnEnterFrame", this);
});

var onEnterFrame = function (dt)
{
  var e;
  for (var i in this._keyDownEvents)
  {
    e = this._keyDownEvents[i];
    TANK.dispatchEvent("OnKeyPress", e.keyCode, this._keysHeld);
    this._keysHeld[e.keyCode] = true;
  }
  this._keyDownEvents = [];

  for (var i in this._keysHeld)
  {
    TANK.dispatchEvent("OnKeyHeld", i);
  }

  for (var i in this._keyUpEvents)
  {
    e = this._keyUpEvents[i];
    TANK.dispatchEvent("OnKeyRelease", e.keyCode, this._keysHeld);
    delete this._keysHeld[e.keyCode];
  }
  this._keyUpEvents = [];

  for (var i in this._mouseMoveEvents)
  {
    e = this._mouseMoveEvents[i];

    this.mousePos = [e.x, e.y];
    if (this._context)
    {
      this.mousePos[0] -= this._context.offsetLeft;
      this.mousePos[1] -= this._context.offsetTop;
    }
    this.mouseDelta = [this.mousePos[0] - this.lastMousePos[0], this.mousePos[1] - this.lastMousePos[1]];

    this.lastMousePos[0] = this.mousePos[0];
    this.lastMousePos[1] = this.mousePos[1];

    var mouseEvent = {};
    mouseEvent.x = this.mousePos[0];
    mouseEvent.y = this.mousePos[1];
    mouseEvent.moveX = this.mouseDelta[0];
    mouseEvent.moveY = this.mouseDelta[1];
    TANK.dispatchEvent("OnMouseMove", mouseEvent, this._keysHeld);
  }
  this._mouseMoveEvents = [];
};
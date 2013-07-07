(function ()
{
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
      {
        that.context.removeEventListener("mousemove", that.mousemove);
        that.context.removeEventListener("mousedown", that.mousedown);
        that.context.removeEventListener("mouseup", that.mouseup);
      }
      else
      {
        removeEventListener("mousemove", that.mousemove);
        removeEventListener("mousedown", that.mousedown);
        removeEventListener("mouseup", that.mouseup);
      }

      that._context = val;
      if (that._context)
      {
        that.context.addEventListener("mousemove", that.mousemove);
        that.context.addEventListener("mousedown", that.mousedown);
        that.context.addEventListener("mouseup", that.mouseup);
      }
      else
      {
        addEventListener("mousemove", that.mousemove);
        addEventListener("mousedown", that.mousedown);
        addEventListener("mouseup", that.mouseup);
      }
    });

    this._context = null;
    this._keyDownEvents = [];
    this._keyUpEvents = [];
    this._mouseMoveEvents = [];
    this._mouseDownEvents = [];
    this._mouseUpEvents = [];
    this._keysHeld = {};
    this._buttonsHeld = {};

    var that = this;
    this.keydown = function (e)
    {
      if (!that._keysHeld[e.keyCode])
        that._keyDownEvents.push(e);
      return false;
    };

    this.keyup = function (e)
    {
      if (that._keysHeld[e.keyCode])
        that._keyUpEvents.push(e);
      return false;
    };

    this.mousemove = function (e)
    {
      that._mouseMoveEvents.push(e);
      return false;
    };

    this.mousedown = function (e)
    {
      that._mouseDownEvents.push(e);
      return false;
    };

    this.mouseup = function (e)
    {
      that._mouseUpEvents.push(e);
      return false;
    };

    this.context = null;
  })

  .initialize(function ()
  {
    addEventListener("keydown", this.keydown);
    addEventListener("keyup", this.keyup);
    this.addEventListener("OnEnterFrame", OnEnterFrame);
  })

  .destruct(function ()
  {
    removeEventListener("keydown", this.keydown);
    removeEventListener("keyup", this.keyup);
    if (this.context)
    {
      this.context.removeEventListener("mousemove", this.mousemove);
      this.context.removeEventListener("mousedown", this.mousedown);
      this.context.removeEventListener("mouseup", this.mouseup);
    }
    else
    {
      removeEventListener("mousemove", this.mousemove);
      removeEventListener("mousedown", this.mousedown);
      removeEventListener("mouseup", this.mouseup);
    }

    this.removeEventListener("OnEnterFrame", OnEnterFrame);
  });

  var OnEnterFrame = function (dt)
  {
    var e;
    for (var i in this._keyDownEvents)
    {
      e = this._keyDownEvents[i];
      this.space.dispatchEvent("OnKeyPress", e.keyCode, this._keysHeld, this._buttonsHeld);
      this._keysHeld[e.keyCode] = true;
    }
    this._keyDownEvents = [];

    for (var i in this._keysHeld)
    {
      this.space.dispatchEvent("OnKeyHeld", i);
    }

    for (var i in this._keyUpEvents)
    {
      e = this._keyUpEvents[i];
      this.space.dispatchEvent("OnKeyRelease", e.keyCode, this._keysHeld, this._buttonsHeld);
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
      this.space.dispatchEvent("OnMouseMove", mouseEvent, this._keysHeld, this._buttonsHeld);
    }
    this._mouseMoveEvents = [];

    for (var i in this._mouseDownEvents)
    {
      e = this._mouseDownEvents[i];
      this.space.dispatchEvent("OnMouseDown", e.button, this._keysHeld, this._buttonsHeld);
      this._buttonsHeld[e.button] = true;
    }
    this._mouseDownEvents = [];

    for (var i in this._buttonsHeld)
    {
      this.space.dispatchEvent("OnMouseButtonHeld", i);
    }

    for (var i in this._mouseUpEvents)
    {
      e = this._mouseUpEvents[i];
      this.space.dispatchEvent("OnMouseUp", e.button, this._keysHeld, this._buttonsHeld);
      delete this._buttonsHeld[e.button];
    }
    this._mouseUpEvents = [];
  };
}());

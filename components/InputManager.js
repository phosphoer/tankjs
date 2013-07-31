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

    // ### Prevent default keyboard events
    // When set to true the browser won't handle
    // keyboard events like F5 and Back
    this.preventKeyboardDefault = true;

    // ### Prevent default mouse
    // When set to true the browser won't handle
    // mouse events like drag selecting
    this.preventMouseDefault = true;

    // ### Prevent right click
    // When set to true the browser won't
    // display the default context menu on a
    // right click
    this.preventRightClick = true;

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
        that.context.removeEventListener("mousewheel", that.mousewheel);
        that.context.removeEventListener("contextmenu", that.contextmenu);
      }
      else
      {
        removeEventListener("mousemove", that.mousemove);
        removeEventListener("mousedown", that.mousedown);
        removeEventListener("mouseup", that.mouseup);
        removeEventListener("mousewheel", that.mousewheel);
        removeEventListener("contextmenu", that.contextmenu);
      }

      that._context = val;
      if (that._context)
      {
        that.context.addEventListener("mousemove", that.mousemove);
        that.context.addEventListener("mousedown", that.mousedown);
        that.context.addEventListener("mouseup", that.mouseup);
        that.context.addEventListener("mousewheel", that.mousewheel);
        that.context.addEventListener("contextmenu", that.contextmenu);
      }
      else
      {
        addEventListener("mousemove", that.mousemove);
        addEventListener("mousedown", that.mousedown);
        addEventListener("mouseup", that.mouseup);
        addEventListener("mousewheel", that.mousewheel);
        addEventListener("contextmenu", that.contextmenu);
      }
    });

    this._context = null;
    this._keyDownEvents = [];
    this._keyUpEvents = [];
    this._mouseMoveEvents = [];
    this._mouseDownEvents = [];
    this._mouseUpEvents = [];
    this._mouseWheelEvents = [];
    this._keysHeld = {};
    this._buttonsHeld = {};

    var that = this;
    this.keydown = function (e)
    {
      if (!that._keysHeld[e.keyCode])
        that._keyDownEvents.push(e);

      if (that.preventKeyboardDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    };

    this.keyup = function (e)
    {
      if (that._keysHeld[e.keyCode])
        that._keyUpEvents.push(e);
      if (e.preventDefault)
        e.preventDefault();
      if (e.stopPropagation)
        e.stopPropagation();

      if (that.preventKeyboardDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    };

    this.mousemove = function (e)
    {
      that._mouseMoveEvents.push(e);

      if (that.preventMouseDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    };

    this.mousedown = function (e)
    {
      that._mouseDownEvents.push(e);

      if (that.preventMouseDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    };

    this.mouseup = function (e)
    {
      that._mouseUpEvents.push(e);

      if (that.preventMouseDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    };

    this.mousewheel = function (e)
    {
      that._mouseWheelEvents.push(e);

      if (that.preventMouseDefault)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    }

    this.contextmenu = function (e)
    {
      if (that.preventRightClick)
      {
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();
      }

      return false;
    }

    this.context = null;
  })

  .initialize(function ()
  {
    addEventListener("keydown", this.keydown);
    addEventListener("keyup", this.keyup);
    this.update = OnEnterFrame;
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
      this.context.removeEventListener("mousewheel", this.mousewheel);
      this.context.removeEventListener("contextmenu", this.contextmenu);
    }
    else
    {
      removeEventListener("mousemove", this.mousemove);
      removeEventListener("mousedown", this.mousedown);
      removeEventListener("mouseup", this.mouseup);
      removeEventListener("mousewheel", this.mousewheel);
      removeEventListener("contextmenu", this.contextmenu);
    }
  });

  var OnEnterFrame = function (dt)
  {
    var e;
    // Handle key down events
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

    // Handle key up events
    for (var i in this._keyUpEvents)
    {
      e = this._keyUpEvents[i];
      this.space.dispatchEvent("OnKeyRelease", e.keyCode, this._keysHeld, this._buttonsHeld);
      delete this._keysHeld[e.keyCode];
    }
    this._keyUpEvents = [];

    // Handle mouse move events
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

    // Handle mouse down events
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

    // Handle mouse up events
    for (var i in this._mouseUpEvents)
    {
      e = this._mouseUpEvents[i];
      this.space.dispatchEvent("OnMouseUp", e.button, this._keysHeld, this._buttonsHeld);
      delete this._buttonsHeld[e.button];
    }
    this._mouseUpEvents = [];

    // Handle mouse wheel events
    for (var i in this._mouseWheelEvents)
    {
      e = this._mouseWheelEvents[i];
      this.space.dispatchEvent("OnMouseWheel", e.wheelDelta, this._keysHeld, this._buttonsHeld);
    }
    this._mouseWheelEvents = [];
  };
}());
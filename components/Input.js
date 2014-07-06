(function()
{
  "use strict";

  TANK.registerComponent("Input")
  .construct(function()
  {
    this.context = null;
    this.mousePos = [0, 0];
    this.lastMousePos = [0, 0];
    this.mouseDelta = [0, 0];

    this._keysHeld = [];

    this._events =
    [
      "keydown",
      "keyup",
      "mousemove",
      "mousedown",
      "mouseup",
      "touchmove",
      "touchstart",
      "touchend",
      "mousewheel",
      "contextmenu",
      "gestureend",
      "gesturechange"
    ];

    this._noContextEvents =
    {
      "keydown": true,
      "keyup": true
    };
  })
  .initialize(function()
  {
    var context = this.context || window;
    var that = this;

    var eventHandler = function(e)
    {
      e.preventDefault();

      var shouldAdd = true;

      if (e.type === "mousemove")
      {
        that.lastMousePos[0] = that.mousePos[0];
        that.lastMousePos[1] = that.mousePos[1];
        that.mousePos[0] = e.x - (that.context ? that.context.offsetLeft : 0);
        that.mousePos[1] = e.y - (that.context ? that.context.offsetTop : 0);
        that.mouseDelta = TANK.Math2D.subtract(that.mousePos, that.lastMousePos);
      }

      if (e.type === "keydown")
      {
        if (that._keysHeld[e.keyCode])
          shouldAdd = false;
        else
          that._keysHeld[e.keyCode] = true;
      }

      if (e.type === "keyup")
      {
        if (!that._keysHeld[e.keyCode])
          shouldAdd = false;
        else
          that._keysHeld[e.keyCode] = false;
      }

      if (e.type === "mousedown")
        that._keysHeld[e.button] = true;
      else if (e.type === "mouseup")
        that._keysHeld[e.button] = false;

      if (shouldAdd)
        that._entity.dispatchNextFrame(e.type, e);
    };

    this.addListeners = function()
    {
      for (var i = 0; i < this._events.length; ++i)
      {
        if (this._noContextEvents[this._events[i]])
          window.addEventListener(this._events[i], eventHandler);
        else
          context.addEventListener(this._events[i], eventHandler);
      }
    };

    this.removeListeners = function()
    {
      for (var i = 0; i < this._events.length; ++i)
      {
        if (this._noContextEvents[this._events[i]])
          window.removeEventListener(this._events[i], eventHandler);
        else
          context.removeEventListener(this._events[i], eventHandler);
      }
    };

    this.isDown = function(keyCode)
    {
      return this._keysHeld[keyCode];
    };

    this.addListeners();
  })
  .uninitialize(function()
  {
    this.removeListeners();
  });

})();
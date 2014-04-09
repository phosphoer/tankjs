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
    this._buttonsHeld = [];

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
  })
  .initialize(function()
  {
    var context = this.context || window;
    var that = this;

    var eventHandler = function(e)
    {
      e.preventDefault();

      var shouldAdd = true;

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

      if (shouldAdd)
        that._entity.dispatchNextFrame(e.type, e);
    };

    this.addListeners = function()
    {
      for (var i = 0; i < this._events.length; ++i)
        context.addEventListener(this._events[i], eventHandler);
    };

    this.removeListeners = function()
    {
      for (var i = 0; i < this._events.length; ++i)
        context.removeEventListener(this._events[i], eventHandler);
    };

    this.addListeners();
  })
  .uninitialize(function()
  {
    this.removeListeners();
  });

})();
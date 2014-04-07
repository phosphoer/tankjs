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

    this._pendingEvents = {};
  })
  .initialize(function()
  {
    var context = this.context || window;
    var that = this;

    var eventHandler = function(e)
    {
      e.preventDefault();

      var shouldAdd = true;
      if (!that._pendingEvents[e.type])
        that._pendingEvents[e.type] = [];

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
        that._pendingEvents[e.type].push(e);
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

    this.update = function(dt)
    {
      // Dispatch all pending events
      for (var i in this._pendingEvents)
      {
        var eventList = this._pendingEvents[i];
        for (var j = 0; eventList && j < eventList.length; ++j)
        {
          var e = eventList[j];
          this._entity.dispatchEvent(e.type, e);
        }
        this._pendingEvents[i] = [];
      }
    };

    this.addListeners();
  })
  .uninitialize(function()
  {
    this.removeListeners();
  });

})();
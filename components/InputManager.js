TankJS.addComponent("InputManager")

.initFunction(function()
{
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

  addEventListener("keydown", this.keydown);
  addEventListener("keyup", this.keyup);
  TankJS.addEventListener("OnEnterFrame", this);
})

.uninitFunction(function()
{
  removeEventListener("keydown", this.keydown);
  removeEventListener("keyup", this.keyup);
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
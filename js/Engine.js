(function (TankJS, undefined)
{

// Map of objects tracked by the core
// Key is the id of the object
TankJS._objects = {};

// Secondary map of objects with name as key
TankJS._objectsNamed = {};

// List of objects to delete
TankJS._objectsDeleted = [];

// Map of current registered component types
// Key is the name of the component
TankJS._components = {};

// Map of objects listening for a message
TankJS._events = {};

// Current ID for game objects
TankJS._currentID = 0;

// Create a game object
TankJS.addObject = function(name)
{
  // Create the object
  var obj = new TankJS.GameObject(this._currentID++);

  // If a name was specified, track it by the name
  if (name)
  {
    obj.name = name;
    TankJS._objectsNamed[name] = obj;
  }

  // Track the object by its id
  TankJS._objects[obj.id] = obj;

  return obj;
}

// Remove a game object
TankJS.removeObject = function(id)
{
  // Uninitialize the game object
  var obj = TankJS._objects[id];
  obj.uninit();

  // Remove from object map
  delete TankJS._objects[id];
  delete TankJS._objects[obj.name];
}

// Remove a named game object
TankJS.removeNamedObject = function(name)
{
  // Don't bother if it doesn't exist
  var obj = TankJS._objectsNamed[name];
  if (!obj)
    return;

  // Remove the object
  TankJS.removeObject(obj.id);
}

// Get a game object by id
TankJS.getGameObject = function(id)
{
  return TankJS._objects[id];
}

// Get a named game object
TankJS.getNamedGameObject = function(name)
{
  return TankJS._objectsNamed[name];
}

// Register a new component type
TankJS.addComponent = function(componentName)
{
  var c = new TankJS.Component(componentName);
  TankJS._components[componentName] = c;
  return c;
}

TankJS.addEventListener = function(eventName, func, thisObj)
{
  // Get map of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
  {
    listeners = {};
    TankJS._events[eventName] = listeners;
  }

  // Add listener to the map
  listeners[func] = {func: func, thisObj: thisObj};
}

TankJS.removeEventListener = function(eventName, func)
{
  // Get map of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
    return;

  // Delete the listener from the map
  delete listeners[func];
}

TankJS.dispatchEvent = function(eventName, args)
{
  // Get map of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
    return;

  // Construct arguments
  var message_args = [];
  for (var i = 1; i < arguments.length; ++i)
    message_args.push(arguments[i]);

  // Invoke the message on each listener
  var func, thisObj;
  for (var i in listeners)
  {
    func = listeners[i].func;
    thisObj = listeners[i].thisObj;
    if (thisObj)
      func.apply(thisObj, message_args);
    else
      func.apply(func, message_args);
  }
}

function update()
{
  // Get dt
  var new_time = new Date();
  var dt = (new_time - TomatoJS.Core.last_time) / 1000.0;
  if (dt > 0.05)
    dt = 0.05;

  // Delete pending objects
  for (var i in TankJS._objectsDeleted)
  {
    var obj = TankJS._objectsDeleted[i];
    obj.uninit();
    delete TankJS._objects[obj.id];
    delete TankJS._objectsNamed[obj.name];
  }
  TankJS._objectsDeleted = [];

  // Queue next frame
  requestAnimFrame(this);
}

} (window.TankJS = window.TankJS || {}));
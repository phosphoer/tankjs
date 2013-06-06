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

// Map of existing component instances sorted by tag names
// Key is the name of the tag
TankJS._taggedComponents = {};

// Map of objects listening for a message
TankJS._events = {};

// Current ID for game objects
TankJS._currentID = 0;

// Last update time
TankJS._lastTime = new Date();

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
  // Add object to trash
  TankJS._objectsDeleted.push(TankJS.getObject(id));
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
TankJS.getObject = function(id)
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

// Get all component instances of a particular tag
TankJS.getComponentsWithTag = function(tag)
{
  return TankJS._taggedComponents[tag];
}

// Reigster a function as an event handler
TankJS.addEventListener = function(eventName, obj)
{
  // Get array of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
  {
    listeners = [];
    TankJS._events[eventName] = listeners;
  }

  // Add listener to the map
  listeners.push(obj);
}

// Unregister a function as an event handler
TankJS.removeEventListener = function(eventName, obj)
{
  // Get array of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
    return;

  // Delete the listener from the map
  for (var i in listeners)
  {
    if (listeners[i] === obj)
    {
      listeners.splice(i, 1);
      break;
    }
  }
}

// Send out an event with arguments
TankJS.dispatchEvent = function(eventName, args)
{
  // Get array of listeners
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
    func = listeners[i][eventName];
    thisObj = listeners[i];
    if (func)
      func.apply(thisObj, message_args);
    else
      console.log("TanksJS: " + thisObj + " is listening for " + eventName + " but does not implement a method of the same name");
  }
}

TankJS.start = function()
{
  TankJS._lastTime = new Date();
  update();
  return this;
}

function update()
{
  // Get dt
  var new_time = new Date();
  var dt = (new_time - TankJS._lastTime) / 1000.0;
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

  // Dispatch enter frame message
  TankJS.dispatchEvent("OnEnterFrame", dt);

  // Queue next frame
  requestAnimFrame(update);
}

} (window.TankJS = window.TankJS || {}));
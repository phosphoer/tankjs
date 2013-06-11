(function (TankJS, undefined)
{

// Map of objects tracked by the core
// Key is the id of the object
TankJS._objects = {};

// Secondary map of objects with name as key
TankJS._objectsNamed = {};

// List of objects to delete
TankJS._objectsDeleted = [];

// Map of prefabs with name as key
TankJS._prefabs = {};

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

// Whether or not the engine is running
TankJS._running = false;

// Whether or not the engine is in the resetting state
TankJS._resetting = false;

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

// Create a game object from a prefab
TankJS.addObjectFromPrefab = function(prefabName, objName)
{
  var prefab = TankJS.getPrefab(prefabName);
  if (!prefab)
  {
    console.log("TankJS.addObjectFromPrefab: Could not find a prefab named " + prefabName);
    return;
  }

  var obj = TankJS.addObject(objName);

  for (var i in prefab)
  {
    var cData = prefab[i];
    obj.addComponent(i);
    var c = obj.getComponent(i);
    for (var j in cData)
    {
      c[j] = cData[j];
    }
  }

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

// Clear all existing objects
TankJS.removeAllObjects = function()
{
  for (var i in TankJS._objects)
    TankJS.removeObject(i);
}

// Get a game object by id
TankJS.getObject = function(id)
{
  return TankJS._objects[id];
}

// Get a named game object
TankJS.getNamedObject = function(name)
{
  return TankJS._objectsNamed[name];
}

// Create a game object prefab
TankJS.addPrefab = function(name, data)
{
  TankJS._prefabs[name] = data;
}

// Get a prefab data
TankJS.getPrefab = function(name)
{
  return TankJS._prefabs[name];
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

  return this;
}

// Unregister a function as an event handler
TankJS.removeEventListener = function(eventName, obj)
{
  // Get array of listeners
  var listeners = TankJS._events[eventName];
  if (!listeners)
    return this;

  // Delete the listener from the map
  for (var i in listeners)
  {
    if (listeners[i] === obj)
    {
      listeners.splice(i, 1);
      break;
    }
  }

  return this;
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
      console.log("TankJS.dispatchEvent: " + thisObj + " is listening for " + eventName + " but does not implement a method of the same name");
  }

  return this;
}

TankJS.start = function()
{
  TankJS._lastTime = new Date();
  TankJS._running = true;
  update();
  return this;
}

TankJS.stop = function()
{
  TankJS._running = false;
  return this;
}

TankJS.reset = function()
{
  TankJS._resetting = true;
  TankJS.removeAllObjects();
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

  // If we are resetting the engine, stop updating before the next frame but after
  // we've cleared up the deleted objects
  if (TankJS._resetting)
  {
    TankJS._resetting = false;
    TankJS._running = false;
    main();
    return;
  }

  // Dispatch enter frame message
  TankJS.dispatchEvent("OnEnterFrame", dt);

  // Queue next frame
  if (TankJS._running)
    requestAnimFrame(update);
}

} (window.TankJS = window.TankJS || {}));
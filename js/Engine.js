// The main TankJS file that provides access to the core functionality of the engine.
// This includes creating and manipulating game objects, registering components, and listening for / dispatching events.

(function (TankJS, undefined)
{

// ### Create a GameObject
// Creates a new `GameObject` and begins tracking it.
//
// - `name`: (optional) A unique name to track the game object by. If the name is
// not unique the existing object by that name will no longer be findable by its name.
// - `return`: A new `GameObject`.
TankJS.addObject = function(name)
{
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

// ### Create GameObject from Prefab
// Creates a new `GameObject` using a given prefab and begins tracking it.
//
// - `prefabName`: Name of the prefab to clone.
// - `objName`: (optional) A unique name to track the game object by. If the name is
// not unique the existing object by that name will no longer be findable by its name.
// - `return`: A new `GameObject`.
TankJS.addObjectFromPrefab = function(prefabName, objName)
{
  var prefab = TankJS.getPrefab(prefabName);
  if (!prefab)
  {
    console.log("TankJS.addObjectFromPrefab: Could not find a prefab named " + prefabName);
    return;
  }

  var obj = TankJS.addObject(objName);

  // Add all the defined prefab components and set the relevant fields
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

// ### Remove a gameobject
// Schedules the given object to be deleted on the next frame.
// Will cause `uninit` to be called on all components of the object before it is deleted.
//
// `id`: The id of the object. (`GameObject.id`)
TankJS.removeObject = function(id)
{
  // Add object to trash
  TankJS._objectsDeleted.push(TankJS.getObject(id));
}

// ### Remove a gameobject by name
// Schedules the given object to be deleted on the next frame.
// Will cause `uninit` to be called on all components of the object before it is deleted.
//
// `name`: The unique name of the object. (`GameObject.name`)
TankJS.removeNamedObject = function(name)
{
  // Don't bother if it doesn't exist
  var obj = TankJS._objectsNamed[name];
  if (!obj)
    return;

  // Remove the object
  TankJS.removeObject(obj.id);
}

// ### Remove all gameobjects
// Equivalent to calling `removeObject` on all objects.
TankJS.removeAllObjects = function()
{
  for (var i in TankJS._objects)
    TankJS.removeObject(i);
}

// ### Get a gameobject by id
//
// - `id`: The id of the game object to get
// - `return`: The requested `GameObject` or `undefined`
TankJS.getObject = function(id)
{
  return TankJS._objects[id];
}

// ### Get a gameobject by name
//
// - `name`: The name of the game object to get
// - `return`: The requested `GameObject` or `undefined`
TankJS.getNamedObject = function(name)
{
  return TankJS._objectsNamed[name];
}

// ### Register an object prefab
// Use this to define a gameobject with a set of components that
// can be instantiated later, like a blueprint.
//
// - `name`: The name of the prefab to store it under.
// - `data`: A JSON object describing the components the prefab should contain,
// with the following format:
//
//       {
//         "2D": { x: 0, y: 42 },
//         "Velocity": {},
//         "Collider": { width: 5, height: 5 },
//       }
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

} (window.TankJS = window.TankJS || {}));
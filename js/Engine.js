// The main TankJS file that provides access to the core functionality of the engine.
// This includes creating and manipulating game objects, registering components, and listening for / dispatching events.

(function (TankJS, undefined)
{

  // ### Enable/Disable error messages
  TankJS.errorsEnabled = true;

  // ### Enable/Disable warning messages
  TankJS.warningsEnabled = true;

  // ### Enable/Disable logging messages
  TankJS.logsEnabled = true;

  TankJS.createObject = function ()
  {
    var object = new TankJS.GameObject(-1);
    return object;
  }

  // ### Create a GameObject
  // Creates a new `GameObject` and begins tracking it.
  //
  // - `name`: (optional) A unique name to track the game object by. If the name is
  // not unique the existing object by that name will no longer be findable by its name.
  // - `return`: A new `GameObject`.
  TankJS.addObject = function (object, name)
  {
    if (object.id != -1)
    {
      TankJS.error("Attempting to add a GameObject twice");
      return;
    }

    object.id = this._currentID++;

    if (object.name === null)
    {
      object.name = "GameObject " + object.id;
    }

    // If a name was specified, track it by the name
    if (name)
    {
      object.name = name;
      TankJS._objectsNamed[name] = object;
    }

    // Track the object by its id
    TankJS._objects[object.id] = object;


    var n, c;
    for (n in object._components)
    {
      var c = object._components[n];
      var componentDef = TankJS._registeredComponents[n];
      for (var i in componentDef._interfaces)
      {
        // Get the list of components with this interface
        var componentList = TankJS._interfaceComponents[componentDef._interfaces[i]];
        if (!componentList)
        {
          componentList = {};
          TankJS._interfaceComponents[componentDef._interfaces[i]] = componentList;
        }

        componentList[object.name + "." + componentDef.name] = c;
      }
    }

    for (n in object._components)
    {
      c = object._components[n];
      c.initialize.apply(c);
    }

    for (n in object._components)
    {
      c = object._components[n];
      TankJS.dispatchEvent("OnComponentInitialized", c);
    }

    return object;
  }

  // ### Create GameObject from Prefab
  // Creates a new `GameObject` using a given prefab and begins tracking it.
  //
  // - `prefabName`: Name of the prefab to clone.
  // - `objName`: (optional) A unique name to track the game object by. If the name is
  // not unique the existing object by that name will no longer be findable by its name.
  // - `return`: A new `GameObject`.
  TankJS.createObjectFromPrefab = function (prefabName)
  {
    var prefab = TankJS.getPrefab(prefabName);
    if (!prefab)
    {
      TankJS.log("Could not find a prefab named " + prefabName);
      return;
    }

    var obj = TankJS.createObject();

    // Add all the defined prefab components and set the relevant fields
    for (var i in prefab)
    {
      var cData = prefab[i];
      obj.addComponent(i);
      var c = obj[i];
      for (var j in cData)
      {
        c[j] = cData[j];
      }
    }

    return obj;
  }

  // ### Get a gameobject by id
  //
  // - `id`: The id of the game object to get
  // - `return`: The requested `GameObject` or `undefined`
  TankJS.getObject = function (id)
  {
    return TankJS._objects[id];
  }

  // ### Get a gameobject by name
  //
  // - `name`: The name of the game object to get
  // - `return`: The requested `GameObject` or `undefined`
  TankJS.getNamedObject = function (name)
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
  //         "Pos2D": { x: 0, y: 42 },
  //         "Velocity": {},
  //         "Collider": { width: 5, height: 5 },
  //       }
  TankJS.addPrefab = function (name, data)
  {
    TankJS._prefabs[name] = data;
  }

  // Get a prefab data
  TankJS.getPrefab = function (name)
  {
    return TankJS._prefabs[name];
  }

  // ### Remove an object
  // Schedules the given object to be deleted on the next frame.
  // Will cause `uninit` to be called on all components of the object before it is deleted.
  //
  // `id`: The id of the object. (`GameObject.id`)
  TankJS.removeObject = function (id)
  {
    // Add object to trash
    TankJS._objectsDeleted.push(TankJS.getObject(id));
  }

  // ### Remove a gameobject by name
  // Schedules the given object to be deleted on the next frame.
  // Will cause `uninit` to be called on all components of the object before it is deleted.
  //
  // `name`: The unique name of the object. (`GameObject.name`)
  TankJS.removeNamedObject = function (name)
  {
    // Don't bother if it doesn't exist
    var obj = TankJS._objectsNamed[name];
    if (!obj)
      return;

    TankJS._objectsDeleted.push(obj);
  }

  // ### Remove all objects
  // Equivalent to calling `removeObject` on all objects.
  TankJS.removeAllObjects = function ()
  {
    for (var i in TankJS._objects)
      TankJS.removeObject(i);
  }

  // Register a new component type
  TankJS.registerComponent = function (componentName)
  {
    // Warn about components with invalid identifiers
    if (componentName[0] >= 0 && componentName[0] <= 9 || componentName.search(" ") >= 0)
    {
      TankJS.error(componentName + " is an invalid identifier and won't be accessible without [] operator");
      return;
    }

    var c = new TankJS.Component(componentName);
    TankJS._registeredComponents[componentName] = c;
    return c;
  }

  // Add a component to the engine
  TankJS.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (TankJS[componentName])
      return;

    // Get the component definition object
    var componentDef = TankJS._registeredComponents[componentName];
    if (!componentDef)
    {
      TankJS.error("No component registered with name " + componentName);
      return;
    }

    // Temporarily add a fake component just to mark this one as added
    // for the upcoming recursive calls
    TankJS[componentName] = "Placeholder";
    TankJS._components[componentName] = "Placeholder";

    // Add all the included components
    for (var i in componentDef._includes)
    {
      TankJS.addComponent(componentDef._includes[i]);
    }

    // Clone the component into our list of components
    var c = componentDef.clone();
    TankJS[componentName] = c;
    TankJS._components[componentName] = c;

    // Track this component by its interaces
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TankJS._interfaceComponents[componentDef._interfaces[i]];
      if (!componentList)
      {
        componentList = {};
        TankJS._interfaceComponents[componentDef._interfaces[i]] = componentList;
      }

      componentList["TankJS" + "." + componentDef.name] = c;
    }

    // Set some attributes of the component instance
    // The parent is null because it is a global component
    c.parent = null;

    // Initialize the component
    c.construct.apply(c);
    c.init.apply(c);

    return TankJS;
  }

  // Add a list of components to the engine
  TankJS.addComponents = function (componentNames)
  {
    // Get array of component names
    componentNames = componentNames.replace(/\s/g, "");
    var components = componentNames.split(",");

    // Add components to object
    for (var i in components)
    {
      TankJS.addComponent(components[i]);
    }
  }

  // ### Find components with interface
  // Gets all component instances that implement a particular interface
  //
  // - `interfaceName`: Name of the interface that returned components should implement
  // - `return`: An array of component instances
  TankJS.getComponentsWithInterface = function (interfaceName)
  {
    return TankJS._interfaceComponents[interfaceName];
  }

  // Reigster a function as an event handler
  TankJS.addEventListener = function (eventName, obj)
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
  TankJS.removeEventListener = function (eventName, obj)
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
  TankJS.dispatchEvent = function (eventName, args)
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
        TankJS.log(thisObj + " is listening for " + eventName + " but does not implement a method of the same name");
    }
  }

  TankJS.start = function ()
  {
    TankJS._lastTime = new Date();
    TankJS._running = true;
    update()
  }

  TankJS.stop = function ()
  {
    TankJS._running = false
  }

  TankJS.reset = function ()
  {
    TankJS._resetting = true;
    TankJS.removeAllObjects();
    return this;
  }

  TankJS.log = function (text)
  {
    if (!TankJS.logsEnabled)
      return;

    if (arguments.callee.caller.name)
      console.log(arguments.callee.caller.name + ": " + text);
    else
      console.log("(anonymous function): " + text);
  }

  TankJS.warn = function (text)
  {
    if (!TankJS.warningsEnabled)
      return;

    if (arguments.callee.caller.name)
      console.warn(arguments.callee.caller.name + ": " + text);
    else
      console.warn("(anonymous function): " + text);
  }

  TankJS.error = function (text)
  {
    if (!TankJS.errorsEnabled)
      return;

    if (arguments.callee.caller.name)
      console.error(arguments.callee.caller.name + ": " + text);
    else
      console.error("(anonymous function): " + text);
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
      obj.destruct();
      delete TankJS._objects[obj.id];
      delete TankJS._objectsNamed[obj.name];
      obj.id = -1;
      obj.name = "Deleted";
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

  // Map of current engine components
  // Key is the name of the component
  TankJS._components = {};

  // Map of current registered component types
  // Key is the name of the component
  TankJS._registeredComponents = {};

  // Map of existing component instances sorted by tag names
  // Key is the name of the tag
  TankJS._interfaceComponents = {};

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

}(window.TankJS = window.TankJS ||
{}));
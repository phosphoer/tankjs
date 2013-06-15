// The main TANK file that provides access to the core functionality of the engine.
// This includes creating and manipulating game objects, registering components, and listening for / dispatching events.

(function (TANK, undefined)
{

  // ### Enable/Disable error messages
  TANK.errorsEnabled = true;

  // ### Enable/Disable warning messages
  TANK.warningsEnabled = true;

  // ### Enable/Disable logging messages
  TANK.logsEnabled = true;

  TANK.createEntity = function ()
  {
    var object = new TANK.Entity(-1);
    return object;
  }

  // ### Create a Entity
  // Creates a new `Entity` and begins tracking it.
  //
  // - `name`: (optional) A unique name to track the game object by. If the name is
  // not unique the existing object by that name will no longer be findable by its name.
  // - `return`: A new `Entity`.
  TANK.addEntity = function (object, name)
  {
    if (object.id != -1)
    {
      TANK.error("Attempting to add a Entity twice");
      return;
    }

    object.id = this._currentID++;

    if (object.name === null)
    {
      object.name = "Entity " + object.id;
    }

    // If a name was specified, track it by the name
    if (name)
    {
      object.name = name;
      TANK._objectsNamed[name] = object;
    }

    // Track the object by its id
    TANK._objects[object.id] = object;


    var n, c;
    for (n in object._components)
    {
      var c = object._components[n];
      var componentDef = TANK._registeredComponents[n];
      for (var i in componentDef._interfaces)
      {
        // Get the list of components with this interface
        var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];
        if (!componentList)
        {
          componentList = {};
          TANK._interfaceComponents[componentDef._interfaces[i]] = componentList;
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
      TANK.dispatchEvent("OnComponentInitialized", c);
    }

    return object;
  }

  // ### Create Entity from Prefab
  // Creates a new `Entity` using a given prefab and begins tracking it.
  //
  // - `prefabName`: Name of the prefab to clone.
  // - `objName`: (optional) A unique name to track the game object by. If the name is
  // not unique the existing object by that name will no longer be findable by its name.
  // - `return`: A new `Entity`.
  TANK.createEntityFromPrefab = function (prefabName)
  {
    var prefab = TANK.getPrefab(prefabName);
    if (!prefab)
    {
      TANK.log("Could not find a prefab named " + prefabName);
      return;
    }

    var obj = TANK.createEntity();

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
  // - `return`: The requested `Entity` or `undefined`
  TANK.getEntity = function (id)
  {
    return TANK._objects[id];
  }

  // ### Get a gameobject by name
  //
  // - `name`: The name of the game object to get
  // - `return`: The requested `Entity` or `undefined`
  TANK.getNamedEntity = function (name)
  {
    return TANK._objectsNamed[name];
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
  TANK.addPrefab = function (name, data)
  {
    TANK._prefabs[name] = data;
  }

  // Get a prefab data
  TANK.getPrefab = function (name)
  {
    return TANK._prefabs[name];
  }

  // ### Remove an object
  // Schedules the given object to be deleted on the next frame.
  // Will cause `uninit` to be called on all components of the object before it is deleted.
  //
  // `id`: The id of the object. (`Entity.id`)
  TANK.removeEntity = function (id)
  {
    // Add object to trash
    TANK._objectsDeleted.push(TANK.getEntity(id));
  }

  // ### Remove a gameobject by name
  // Schedules the given object to be deleted on the next frame.
  // Will cause `uninit` to be called on all components of the object before it is deleted.
  //
  // `name`: The unique name of the object. (`Entity.name`)
  TANK.removeNamedEntity = function (name)
  {
    // Don't bother if it doesn't exist
    var obj = TANK._objectsNamed[name];
    if (!obj)
      return;

    TANK._objectsDeleted.push(obj);
  }

  // ### Remove all objects
  // Equivalent to calling `removeEntity` on all objects.
  TANK.removeAllEntities = function ()
  {
    for (var i in TANK._objects)
      TANK.removeEntity(i);
  }

  // Register a new component type
  TANK.registerComponent = function (componentName)
  {
    // Warn about components with invalid identifiers
    if (componentName[0] >= 0 && componentName[0] <= 9 || componentName.search(" ") >= 0)
    {
      TANK.error(componentName + " is an invalid identifier and won't be accessible without [] operator");
      return;
    }

    var c = new TANK.Component(componentName);
    TANK._registeredComponents[componentName] = c;
    return c;
  }

  // Add a component to the engine
  TANK.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (TANK[componentName])
      return;

    // Get the component definition object
    var componentDef = TANK._registeredComponents[componentName];
    if (!componentDef)
    {
      TANK.error("No component registered with name " + componentName);
      return;
    }

    // Temporarily add a fake component just to mark this one as added
    // for the upcoming recursive calls
    TANK[componentName] = "Placeholder";
    TANK._components[componentName] = "Placeholder";

    // Add all the included components
    for (var i in componentDef._includes)
    {
      TANK.addComponent(componentDef._includes[i]);
    }

    // Clone the component into our list of components
    var c = componentDef.clone();
    TANK[componentName] = c;
    TANK._components[componentName] = c;

    // Track this component by its interaces
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];
      if (!componentList)
      {
        componentList = {};
        TANK._interfaceComponents[componentDef._interfaces[i]] = componentList;
      }

      componentList["TANK" + "." + componentDef.name] = c;
    }

    // Set some attributes of the component instance
    // The parent is null because it is a global component
    c.parent = null;

    // Initialize the component
    c.construct.apply(c);
    c.initialize.apply(c);

    return TANK;
  }

  // Add a list of components to the engine
  TANK.addComponents = function (componentNames)
  {
    // Get array of component names
    componentNames = componentNames.replace(/\s/g, "");
    var components = componentNames.split(",");

    // Add components to object
    for (var i in components)
    {
      TANK.addComponent(components[i]);
    }
  }

  TANK.removeComponent = function (componentName)
  {
    // If we don't have the component then just return
    var c = TANK[componentName];
    if (!c)
      return;

    // Inform the engine this component was uninitialized
    TANK.dispatchEvent("OnComponentUninitialized", c);

    // Uninitialize the component
    c.destruct.apply(c);

    // Stop tracking this component by its interfaces
    var componentDef = TANK._registeredComponents[componentName];
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];

      if (componentList)
        delete componentList[this.name + "." + componentDef.name];
    }

    // Remove component
    delete TANK._components[componentName];
    delete TANK[componentName];
  }

  // ### Find components with interface
  // Gets all component instances that implement a particular interface
  //
  // - `interfaceName`: Name of the interface that returned components should implement
  // - `return`: An array of component instances
  TANK.getComponentsWithInterface = function (interfaceName)
  {
    return TANK._interfaceComponents[interfaceName];
  }

  // Reigster a function as an event handler
  TANK.addEventListener = function (eventName, obj)
  {
    // Get array of listeners
    var listeners = TANK._events[eventName];
    if (!listeners)
    {
      listeners = [];
      TANK._events[eventName] = listeners;
    }

    // Add listener to the map
    listeners.push(obj);
  }

  // Unregister a function as an event handler
  TANK.removeEventListener = function (eventName, obj)
  {
    // Get array of listeners
    var listeners = TANK._events[eventName];
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
  TANK.dispatchEvent = function (eventName, args)
  {
    // Get array of listeners
    var listeners = TANK._events[eventName];
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
        TANK.log(thisObj + " is listening for " + eventName + " but does not implement a method of the same name");
    }
  }

  TANK.start = function ()
  {
    TANK._lastTime = new Date();
    TANK._running = true;
    update()
  }

  TANK.stop = function ()
  {
    TANK._running = false
  }

  TANK.reset = function ()
  {
    TANK._resetting = true;
    TANK.removeAllEntities();
    return this;
  }

  TANK.log = function (text)
  {
    if (!TANK.logsEnabled)
      return;

    if (arguments.callee.caller.name)
      console.log(arguments.callee.caller.name + ": " + text);
    else
      console.log("(anonymous function): " + text);
  }

  TANK.warn = function (text)
  {
    if (!TANK.warningsEnabled)
      return;

    if (arguments.callee.caller.name)
      console.warn(arguments.callee.caller.name + ": " + text);
    else
      console.warn("(anonymous function): " + text);
  }

  TANK.error = function (text)
  {
    if (!TANK.errorsEnabled)
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
    var dt = (new_time - TANK._lastTime) / 1000.0;
    if (dt > 0.05)
      dt = 0.05;

    // Delete pending objects
    for (var i in TANK._objectsDeleted)
    {
      var obj = TANK._objectsDeleted[i];
      obj.destruct();
      delete TANK._objects[obj.id];
      delete TANK._objectsNamed[obj.name];
      obj.id = -1;
      obj.name = "Deleted";
    }
    TANK._objectsDeleted = [];

    // If we are resetting the engine, stop updating before the next frame but after
    // we've cleared up the deleted objects
    if (TANK._resetting)
    {
      TANK._resetting = false;
      TANK._running = false;
      main();
      return;
    }

    // Dispatch enter frame message
    TANK.dispatchEvent("OnEnterFrame", dt);

    // Queue next frame
    if (TANK._running)
      requestAnimFrame(update);
  }

  // Map of objects tracked by the core
  // Key is the id of the object
  TANK._objects = {};

  // Secondary map of objects with name as key
  TANK._objectsNamed = {};

  // List of objects to delete
  TANK._objectsDeleted = [];

  // Map of prefabs with name as key
  TANK._prefabs = {};

  // Map of current engine components
  // Key is the name of the component
  TANK._components = {};

  // Map of current registered component types
  // Key is the name of the component
  TANK._registeredComponents = {};

  // Map of existing component instances sorted by tag names
  // Key is the name of the tag
  TANK._interfaceComponents = {};

  // Map of objects listening for a message
  TANK._events = {};

  // Current ID for game objects
  TANK._currentID = 0;

  // Last update time
  TANK._lastTime = new Date();

  // Whether or not the engine is running
  TANK._running = false;

  // Whether or not the engine is in the resetting state
  TANK._resetting = false;

}(this.TANK = this.TANK ||
{}));
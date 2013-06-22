// The MIT License (MIT)
//
// Copyright (c) 2013 David Evans, Killian Koenig
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.


// The main TANK file that provides access to the core functionality of the engine.
// This includes creating and manipulating entities, registering components, and dispatching events.
(function (TANK)
{
  "use strict";

  // ### Enable/Disable error messages
  TANK.errorsEnabled = true;

  // ### Enable/Disable warning messages
  TANK.warningsEnabled = true;

  // ### Enable/Disable logging messages
  TANK.logsEnabled = true;

  // ### Create an Entity
  // Creates a new `Entity` and returns it. The parameters to the function are passed
  // directly to `Entity.addComponents` after construction.
  //
  // - `return`: A new `Entity`.
  TANK.createEntity = function ()
  {
    var entity = new TANK.Entity(-1);
    return entity.addComponents.apply(entity, arguments);
  };

  // ### Create Entity from prefab
  // Creates a new `Entity` using a given prefab.
  //
  // - `prefabName`: Name of the prefab to clone.
  // - `return`: A new `Entity`.
  TANK.createEntityFromPrefab = function (prefabName)
  {
    var prefab = TANK.getPrefab(prefabName);
    if (!prefab)
    {
      TANK.warning("Could not find a prefab named " + prefabName);
      return;
    }

    var entity = TANK.createEntity();
    var component;
    var componentData;
    var componentName, propertyName;
    for (componentName in prefab)
    {
      if (prefab.hasOwnProperty(componentName))
      {
        entity.addComponent(componentName);

        // Copy over fields from prefab into new component
        component = entity[componentName];
        componentData = prefab[componentName];
        for (propertyName in componentData)
        {
          if (componentData.hasOwnProperty(propertyName))
          {
            component[propertyName] = componentData[propertyName];
          }
        }
      }
    }

    return entity;
  };

  TANK.addSpace = function (name)
  {
    if (TANK[name])
    {
      TANK.error("Space or component with name " + name + " already exists");
      return;
    }

    var space = new TANK.Space(name);
    space._initialized = true;
    TANK._spaces[name] = space;
    TANK[name] = space;
  }

  // ### Register an object prefab
  // Use this to define an entity with a set of components that
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
    return data;
  };

  // ### Get a prefab object
  //
  // - `name`: The name of the prefab to find.
  // - `return`: A prefab JSON object.
  TANK.getPrefab = function (name)
  {
    return TANK._prefabs[name];
  };

  // ### Register a new component type
  // Creates a new `Component` instance which defines a blueprint
  // for a type of component.
  //
  // - `componentName`: The name of the component type to register. This must be a valid identifier.
  // - `return`: A new instance of type `Component`.
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
  };

  // ### Add a component to the engine
  // Components added to the engine are "global" and not
  // affected by spaces. These are commonly used to add systems
  // that contain global state, such as a graphics context. After a component is added,
  // it can be accessed via `TANK.ComponentName`.
  //
  // - `componentName`: The name of the component to add to the engine.
  TANK.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (TANK[componentName])
    {
      return;
    }

    // Create engine entity if it doesn't exist
    if (!TANK._engineSpace)
    {
      TANK._engineSpace = new TANK.Space("TANK");
    }

    TANK._engineSpace.addComponent(componentName);
    TANK[componentName] = TANK._engineSpace[componentName];

    // Only run initialize if the engine is already running
    // because all components are initialized on `TANK.start()`
    if (TANK._running)
    {
      TANK[componentName].initialize();
    }
  };

  // ### Add multiple components to the engine
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  // e.g., `TANK.addComponents("Pos2D, Velocity", "Image", "Collider");`
  TANK.addComponents = function ()
  {
    var i, j, arg;
    for (i = 0; i < arguments.length; ++i)
    {
      arg = arguments[i];
      arg = arg.replace(/\s/g, "");
      var components = arg.split(",");

      for (j = 0; j < components.length; ++j)
      {
        TANK.addComponent(components[j]);
      }
    }
  };

  // ### Remove a component from the engine
  //
  // - `componentName`: The name of the component to remove.
  TANK.removeComponent = function (componentName)
  {
    var c = TANK[componentName];
    if (!c)
    {
      return;
    }

    if (TANK._engineSpace)
    {
      TANK._engineSpace.removeComponent(componentName);
      delete TANK[componentName];
    }
  };

  // ### Find components with a given interface
  // Gets all component instances that implement a particular interface.
  //
  // - `interfaceName`: Name of the interface that returned components should implement.
  // - `return`: An array of component instances.
  TANK.getComponentsWithInterface = function (interfaceName)
  {
    return TANK._interfaceComponents[interfaceName];
  };

  // ### Send out an event
  // Takes any number of arguments after event name.
  //
  // `eventName` - Name of the event to trigger.
  TANK.dispatchEvent = function (eventName)
  {
    // Dispatch to every space
    TANK._engineSpace.dispatchEvent(eventName);
    for (var i in TANK._spaces)
    {
      if (!TANK._spaces.hasOwnProperty(i))
        continue;
      TANK._spaces[i].dispatchEvent.apply(TANK._spaces[i], arguments);
    }
  };

  // ### Start the engine main loop
  TANK.start = function ()
  {
    TANK._lastTime = new Date();
    TANK._running = true;

    // Initialize all engine components
    if (!TANK._engineSpace)
      TANK._engineSpace = new TANK.Space("TANK");
    if (TANK._engineSpace._spaceEntity)
      TANK._engineSpace._spaceEntity.invoke("initialize");

    update()
  };

  // ### Stop the engine
  TANK.stop = function ()
  {
    TANK._running = false
  };

  // ### Reset the engine
  // This deletes all game objects and resets the state of the engine.
  // Things like prefabs and component definitions are preserved.
  TANK.reset = function ()
  {
    TANK._resetting = true;
    TANK.removeAllEntities();
  };

  // ### Log a message to console
  //
  // `text` - Text to display.
  TANK.log = function (text)
  {
    if (!TANK.logsEnabled)
      return;

    console.log(text);
  };


  // ### Log a warning message to console
  //
  // `text` - Text to display.
  TANK.warn = function (text)
  {
    if (!TANK.warningsEnabled)
      return;

    console.warn(text);
  };

  // ### Log an error message to console
  //
  // `text` - Text to display.
  TANK.error = function (text)
  {
    if (!TANK.errorsEnabled)
      return;

    console.error(text);
  };

  function update()
  {
    // Get dt
    var new_time = new Date();
    var dt = (new_time - TANK._lastTime) / 1000.0;
    if (dt > 0.05)
      dt = 0.05;

    // If we are resetting the engine, stop updating before the next frame but after
    // we've cleared up the deleted objects
    if (TANK._resetting)
    {
      // Remove all engine components
      for (var i in TANK._engineEntity._components)
        delete TANK[i];
      TANK._engineEntity.destruct();

      TANK._resetting = false;
      TANK._running = false;
      main();
      return;
    }

    // Update spaces
    TANK._engineSpace.update(dt);
    for (var i in TANK._spaces)
    {
      if (!TANK._spaces.hasOwnProperty(i))
        continue;

      TANK._spaces[i].update(dt);
    }

    // Dispatch enter frame message
    TANK.dispatchEvent("OnEnterFrame", dt);

    // Queue next frame
    if (TANK._running)
      requestAnimFrame(update);
  };

  // Map of spaces by name
  TANK._spaces = {};

  // Map of prefabs with name as key
  TANK._prefabs = {};

  // "Proxy" entity that stores engine components
  TANK._engineSpace = null;

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
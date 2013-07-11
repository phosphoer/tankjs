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


// The `TANK` namespace provides access to the core functionality of the engine.
// This includes creating/manipulating entities, and dispatching events.
(function (TANK)
{
  "use strict";

  // ### Messages sent
  // - `OnEnterFrame` is sent every frame with the parameter `dt` as the elapsed time in seconds.

  // ### Enable/Disable error messages
  TANK.errorsEnabled = true;

  // ### Enable/Disable warning messages
  TANK.warningsEnabled = true;

  // ### Enable/Disable logging messages
  TANK.logsEnabled = true;

  // ### Create an Entity
  // Creates a new entity and returns it. The parameters to the function are
  // passed directly to `Entity.addComponents` after construction.
  // Components can be given as a string of comma seperated values, a list of strings, or some combination of the above.

  // `Entity TANK.createEntity(...)`

  // - `...` a string of comma seperated values, a list of strings, or some combination of the above.
  // - `return` A new entity.
  TANK.createEntity = function ()
  {
    var entity = new TANK.Entity(-1);
    return entity.addComponents.apply(entity, arguments);
  };

  // ### Create Entity from prefab
  // Creates a new `Entity` using a given prefab function.

  // `Entity TANK.createEntityFromPrefab(prefabName)`

  // - `prefabName` Name of the prefab function to use.
  // - `return` The return of the prefab function, which should be an Entity.
  TANK.createEntityFromPrefab = function (prefabName)
  {
    var prefab = TANK.getPrefab(prefabName);
    if (!prefab)
    {
      TANK.error("Could not find a prefab named " + prefabName);
      return;
    }
    if (!prefab.apply)
    {
      TANK.error("Prefab function supplied for " + prefabName + " is not a function: " + prefab);
      return;
    }

    return prefab();
  };

  // ### Add an entity to the engine.
  // Adds the given entity to the engine, which will initialize all of its components.

  // `Entity TANK.addEntity(object, name)`

  // - `object` The entity to add the world.
  // - `name` (optional) A unique name to track the entity by.
  // - `return` The initialized entity.
  TANK.addEntity = TANK.Space.prototype.addEntity;

  // ### Get an entity

  // `TANK.getEntity = function (idOrName)`

  // - `idOrName` Either the id of the entity, or its unique name
  // - `return` The requested `Entity` or `undefined`
  TANK.getEntity = TANK.Space.prototype.getEntity;

  // ### Remove an entity
  // Schedules the given object to be deleted on the next frame.
  // Will cause `destruct` to be called on all components of the object before it is deleted.

  // `void TANK.removeEntity(arg)`

  // `id`: The id of the object. (`Entity.id`)
  TANK.removeEntity = TANK.Space.prototype.removeEntity;

  // ### Remove all objects

  // `void TANK.removeAllEntities()`

  // Equivalent to calling `TANK.removeEntity` on every entity. Schedules all entities for deletion.
  TANK.removeAllEntities = TANK.Space.prototype.removeAllEntities;

  // ### Add a component to the engine
  // After a component is added, it can be accessed via `TANK.ComponentName`.
  // A component the engine is usually a system that manages entities in some way.

  // `void TANK.addComponent(componentName)`

  // - `componentName`: The name of the component to add to the engine.
  TANK.addComponent = TANK.Entity.prototype.addComponent;

  // ### Add multiple components to the engine
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  // e.g., `TANK.addComponents("Pos2D, Velocity", "Image", "Collider");`

  // `void TANK.addComponents(...)`

  // - `...` a string of comma seperated values, a list of strings, or some combination of the above.
  TANK.addComponents = TANK.Entity.prototype.addComponents;

  // ### Remove a component from the engine

  // `void TANK.removeComponent(componentName)`

  // - `componentName` The name of the component to remove.
  TANK.removeComponent = TANK.Entity.prototype.removeComponent;

  // ### Find components with a given interface
  // Gets all component instances that implement a particular interface.

  // `Array<Component> TANK.getComponentsWithInterface(interfaceName)`

  // - `interfaceName` Name of the interface that returned components should implement.
  // - `return` An array of component instances.
  TANK.getComponentsWithInterface = TANK.Space.prototype.getComponentsWithInterface;

  // ### Initialize the engine
  // This is called when TANK.start() is called, so this should almost never
  // be directly called. It initializes each component in the engine.

  // `TANK.initialize()`
  TANK.initialize = TANK.Entity.prototype.initialize;

  // ### Uninitialize the engine
  // Removes all components on the engine, invoking their destructors.
  // Rarely needed outside the engine, more commonly
  // you will want to reset the engine with `TANK.reset`.

  // `TANK.destruct()`
  TANK.destruct = TANK.Entity.prototype.destruct;

  // ### Invoke a method on the engine.
  // Attempts to invoke the given method name on each component
  // contained in the engine. Components that do not contain
  // the method are skipped. Any additional parameters given
  // will be passed to the invoked function.

  // `void TANK.invoke(funcName)`

  // - `funcName`: The name of the method to invoke.
  TANK.invoke = TANK.Entity.prototype.invoke;

  // ### Send out an event
  // Takes any number of arguments after event name.

  // `void TANK.dispatchEvent(eventName)`

  // `eventName` - Name of the event to trigger.
  TANK.dispatchEvent = TANK.Space.prototype.dispatchEvent;

  TANK.clearDeletedObjects = TANK.Space.prototype.clearDeletedObjects;
  TANK.update = TANK.Space.prototype.update;

  // ### Register an object prefab
  // Use this to define a function that constructs an entity with
  // a particular set of components and values.

  // `void TANK.addPrefab(name, func)`

  // - `name` The name of the prefab to store it under.
  // - `func` A function which should create an entity and add components to it,
  // but NOT add it. The return of the function must be the entity.
  TANK.addPrefab = function (name, func)
  {
    TANK._prefabs[name] = func;
  };

  // ### Get a prefab object

  // `function TANK.getPrefab(name)`

  // - `name` The name of the prefab to find.
  // - `return` A prefab function.
  TANK.getPrefab = function (name)
  {
    return TANK._prefabs[name];
  };

  // ### Register a new component type
  // Creates a new component instance which defines a blueprint
  // for a type of component.

  // `Component TANK.registerComponent(componentName)`

  // - `componentName` The name of the component type to register. This must be a valid identifier.
  // - `return` A new instance of type `Component`.
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

  // ### Start the engine main loop

  // `void TANK.start()`
  TANK.start = function ()
  {
    TANK._lastTime = new Date();
    TANK._running = true;

    TANK.initialize();

    TANK.log("TankJS has been started");

    update()
  };

  // ### Stop the engine

  // `void TANK.stop()`
  TANK.stop = function ()
  {
    TANK._running = false
  };

  // ### Reset the engine
  // This deletes all game objects and resets the state of the engine.
  // Things like prefabs and component definitions are preserved.

  // `void TANK.reset()`

  // `entryPointFunc` - Function to call after resetting has completed
  TANK.reset = function (entryPointFunc)
  {
    TANK._entryPointFunc = entryPointFunc;
    TANK._resetting = true;
    TANK.removeAllEntities();
    for (var i in TANK._spaces)
    {
      TANK._spaces[i].removeAllEntities();
    }
  };

  // ### Log a message to console

  // `void TANK.log(text)`

  // `text` - Text to display.
  TANK.log = function (text)
  {
    if (!TANK.logsEnabled)
      return;

    console.log(text);
  };


  // ### Log a warning message to console

  // `void TANK.warn(text)`

  // `text` - Text to display.
  TANK.warn = function (text)
  {
    if (!TANK.warningsEnabled)
      return;

    console.warn(text);
  };

  // ### Log an error message to console

  // `void TANK.error(text)`

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
    var newTime = new Date();
    var dt = (newTime - TANK._lastTime) / 1000.0;
    TANK._lastTime = newTime;
    if (dt > 0.05)
      dt = 0.05;

    // Cleanup each space
    TANK.clearDeletedObjects();
    for (var i in TANK._spaces)
    {
      if (TANK._spaces.hasOwnProperty(i))
      {
        TANK._spaces[i].clearDeletedObjects();
      }
    }

    // If we are resetting the engine, stop updating before the next frame but after
    // we've cleared up the deleted objects
    if (TANK._resetting)
    {
      // Remove all engine components
      TANK.destruct();
      for (var i in TANK._spaces)
      {
        TANK._spaces[i].destruct();
        delete TANK[i];
      }
      TANK._spaces = {};
      TANK._resetting = false;
      TANK._running = false;
      if (TANK._entryPointFunc)
        TANK._entryPointFunc();

      return;
    }

    // Update each space
    TANK.update(dt);
    for (var i in TANK._spaces)
    {
      if (TANK._spaces.hasOwnProperty(i))
      {
        TANK._spaces[i].update(dt);
      }
    }

    // Queue next frame
    if (TANK._running)
      requestAnimFrame(update);
  };

  // Map of prefabs with name as key
  TANK._prefabs = {};

  // Map of spaces by name
  TANK._spaces = {};

  // Array of spaces to delete
  TANK._spacesDeleted = [];

  // Map of current registered component types
  // Key is the name of the component
  TANK._registeredComponents = {};

  // Current ID for game objects
  TANK._currentID = 0;

  // Last update time
  TANK._lastTime = new Date();

  // Whether or not the engine is running
  TANK._running = false;

  // Whether or not the engine is in the resetting state
  TANK._resetting = false;

  // Fields necessary for inherited Space and Entity functions

  // Name of space
  TANK.name = "TANK";

  // Necessary for using some entity functions
  TANK.space = TANK;

  // If the space is paused then no update events will be sent
  TANK.paused = false;

  // True if the space has been added to the engine
  TANK._initialized = false;

  // Map of objects tracked by the core
  // Key is the id of the object
  TANK._objects = {};

  // Secondary map of objects with name as key
  TANK._objectsNamed = {};

  // List of objects to delete
  TANK._objectsDeleted = [];

  // Components for the space
  // Used by entity functions
  TANK._components = {};

  // Map of existing component instances sorted by tag names
  // Key is the name of the tag
  TANK._interfaceComponents = {};

  // Map of objects listening for a message
  TANK._events = {};

}(this.TANK = this.TANK ||
{}));
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


(function (TANK)
{
  "use strict";

  TANK.Space = function ()
  {
    this.name = null;

    // Map of objects tracked by the core
    // Key is the id of the object
    this._objects = {};

    // Secondary map of objects with name as key
    this._objectsNamed = {};

    // List of objects to delete
    TANK._objectsDeleted = [];

    // "Proxy" entity that stores space components
    this._spaceEntity = null;

    // Map of existing component instances sorted by tag names
    // Key is the name of the tag
    TANK._interfaceComponents = {};

    // Map of objects listening for a message
    TANK._events = {};
  };

  // ### Add an entity to the space.
  // Adds the given entity to the space, which will initialize all of its
  // components.
  //
  // - `object`: The entity to add the space.
  // - `name`: (optional) A unique name to track the entity by.
  // - `return`: The initialized entity.
  TANK.Space.prototype.addEntity = function (object, name)
  {
    if (object.id !== -1)
    {
      TANK.error("Attempting to add a Entity twice");
      return object;
    }

    object.id = TANK._currentID++;

    if (object.name === null)
    {
      object.name = "Entity " + object.id;
    }

    // If a name was specified, track it by the name
    if (name)
    {
      object.name = name;
      if (this._objectsNamed[name])
      {
        TANK.error("An Entity named " + name + " already exists");
        return object;
      }
      this._objectsNamed[name] = object;
    }

    // Track the object by its id
    this._objects[object.id] = object;

    // Track the components by their interfaces
    var n, c, componentDef, i;
    for (n in object._components)
    {
      c = object._components[n];
      componentDef = TANK._registeredComponents[n];
      for (i = 0; i < componentDef._interfaces.length; ++i)
      {
        // Get the list of components with this interface
        var componentList = this._interfaceComponents[componentDef._interfaces[i]];
        if (!componentList)
        {
          componentList = {};
          this._interfaceComponents[componentDef._interfaces[i]] = componentList;
        }

        componentList[object.name + "." + componentDef.name] = c;
      }
    }

    // Initialize each component
    for (n in object._components)
    {
      c = object._components[n];
      c.initialize();
    }

    for (n in object._components)
    {
      c = object._components[n];
      this.dispatchEvent("OnComponentInitialized", c);
    }

    object._initialized = true;

    return object;
  };

  // ### Get an entity
  //
  // - `idOrName`: Either the id of the entity, or its unique name
  // - `return`: The requested `Entity` or `undefined`
  TANK.Space.prototype.getEntity = function (idOrName)
  {
    if (typeof idOrName === "string")
    {
      return this._objectsNamed[idOrName];
    }

    if (typeof idOrName === "number")
    {
      return this._objects[idOrName];
    }

    TANK.error("Attemping to get an Entity with neither a string name nor an id number: " + idOrName);
  };

  // ### Remove an object
  // Schedules the given object to be deleted on the next frame.
  // Will cause `destruct` to be called on all components of the object before it is deleted.
  //
  // `id`: The id of the object. (`Entity.id`)
  TANK.Space.prototype.removeEntity = function (arg)
  {
    if (typeof arg === "string" || typeof arg === "number")
    {
      var entity = this.getEntity(arg);
      if (entity)
      {
        this._objectsDeleted.push(this.getEntity(arg));
      }
      else
      {
        TANK.error("Attempting to remove Entity " + arg + " which doesn't exist.");
      }
    }
    else if (arg instanceof TANK.Entity)
    {
      this._objectsDeleted.push(arg);
    }
    else
    {
      TANK.error("Attemping to remove an Entity with neither a string name, id number, or Entity reference: " + arg);
    }
  };

  // ### Remove all objects
  // Equivalent to calling `removeEntity` on each object.
  TANK.Space.prototype.removeAllEntities = function ()
  {
    var i;
    for (i in this._objects)
    {
      if (this._objects.hasOwnProperty(i))
      {
        this.removeEntity(parseInt(i, 10));
      }
    }
  };

  // ### Add a component to the space
  //
  // - `componentName`: The name of the component to add to the engine.
  TANK.Space.prototype.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (this[componentName])
    {
      return;
    }

    // Create engine entity if it doesn't exist
    if (!this._spaceEntity)
    {
      this._spaceEntity = TANK.createEntity();
    }

    this._spaceEntity.addComponent(componentName);
    this[componentName] = this._spaceEntity[componentName];

    // Only run initialize if the engine is already running
    // because all components are initialized on `TANK.start()`
    if (TANK._running)
    {
      this[componentName].initialize();
    }
  };

  // ### Add multiple components to the engine
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  // e.g., `TANK.addComponents("Pos2D, Velocity", "Image", "Collider");`
  TANK.Space.prototype.addComponents = function ()
  {
    var i, j, arg;
    for (i = 0; i < arguments.length; ++i)
    {
      arg = arguments[i];
      arg = arg.replace(/\s/g, "");
      var components = arg.split(",");

      for (j = 0; j < components.length; ++j)
      {
        this.addComponent(components[j]);
      }
    }
  };

  // ### Remove a component from the engine
  //
  // - `componentName`: The name of the component to remove.
  TANK.Space.prototype.removeComponent = function (componentName)
  {
    var c = this[componentName];
    if (!c)
    {
      return;
    }

    if (this._spaceEntity)
    {
      this._spaceEntity.removeComponent(componentName);
      delete this[componentName];
    }
  };

  // ### Find components with a given interface
  // Gets all component instances that implement a particular interface.
  //
  // - `interfaceName`: Name of the interface that returned components should implement.
  // - `return`: An array of component instances.
  TANK.Space.prototype.getComponentsWithInterface = function (interfaceName)
  {
    return this._interfaceComponents[interfaceName];
  };

  // ### Send out an event
  // Takes any number of arguments after event name.
  //
  // `eventName` - Name of the event to trigger.
  TANK.Space.prototype.dispatchEvent = function (eventName)
  {
    // Get array of listeners
    var listeners = this._events[eventName];
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
      thisObj = listeners[i].self;
      if (func && func.apply)
        func.apply(thisObj, message_args);
      else
        TANK.error(thisObj.name + " is listening for " + eventName + " but the supplied method is no longer valid");
    }
  };

}(this.TANK = this.TANK ||
{}));
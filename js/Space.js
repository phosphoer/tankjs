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

// A Space is what keeps track of Entities. Each Space in the engine
// has its own collection of Entities, and also its own components.
// A component on a Space is usually something like a Render Manager or
// Collision Manager that performs some action on the Space's Entities.
// Since Spaces have their own events and can be paused individually,
// they are a convenient way of implementing UI, amongst other things.
(function (TANK)
{
  "use strict";

  TANK.Space = function ()
  {
    // Name of space
    this.name = null;

    // Necessary for using some entity functions
    this.space = this;

    // If the space is paused then no update events will be sent
    this.paused = false;

    // True if the space has been added to the engine
    this._initialized = false;

    // Map of objects tracked by the core
    // Key is the id of the object
    this._objects = {};

    // Secondary map of objects with name as key
    this._objectsNamed = {};

    // List of objects to delete
    this._objectsDeleted = [];

    // Components for the space
    // Used by entity functions
    this._components = {};

    // Map of existing component instances sorted by tag names
    // Key is the name of the tag
    this._interfaceComponents = {};

    // Map of objects listening for a message
    this._events = {};
  };

  // "Borrow" some functions from Entity : )

  // ### Add a component to the space
  // After a component is added, it can be accessed via `Space.ComponentName`.
  // A component on a space is usually a system that manages entities in some way.

  // `void Space.addComponent(componentName)`

  // - `componentName`: The name of the component to add to the space.
  TANK.Space.prototype.addComponent = TANK.Entity.prototype.addComponent;

  // ### Add multiple components to the space
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  // e.g., `Space.addComponents("Pos2D, Velocity", "Image", "Collider");`

  // `void Space.addComponents(...)`

  // - `...` a string of comma seperated values, a list of strings, or some combination of the above.
  TANK.Space.prototype.addComponents = TANK.Entity.prototype.addComponents;

  // ### Remove a component from the space

  // `void Space.removeComponent(componentName)`

  // - `componentName` The name of the component to remove.
  TANK.Space.prototype.removeComponent = TANK.Entity.prototype.removeComponent;

  // ### Invoke a method on the space.
  // Attempts to invoke the given method name on each component
  // contained in the space. Components that do not contain
  // the method are skipped. Any additional parameters given
  // will be passed to the invoked function.

  // `void Space.invoke(funcName)`

  // - `funcName`: The name of the method to invoke.
  TANK.Space.prototype.invoke = TANK.Entity.prototype.invoke;

  // ### Uninitialize the space
  // Removes all components on the space, invoking their destructors.
  // Rarely needed outside the engine, more commonly
  // you will want to remove the space with `TANK.removeSpace()`.

  // `void Space.destruct()`
  TANK.Space.prototype.destruct = TANK.Entity.prototype.destruct;

  // ### Add an entity to the space.
  // Adds the given entity to the space, which will initialize all of its components.

  // `Entity Space.addEntity(object, name)`

  // - `object` The entity to add the world.
  // - `name` (optional) A unique name to track the entity by.
  // - `return` The initialized entity.
  TANK.Space.prototype.addEntity = function (object, name)
  {
    if (object.id !== -1)
    {
      TANK.error("Attempting to add a Entity twice");
      return object;
    }

    // Setup some object properties
    object.id = TANK._currentID++;
    object.space = this;
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

    // Initialize the object
    object.initialize();

    return object;
  };

  // ### Get an entity

  // `Space.getEntity = function (idOrName)`

  // - `idOrName` Either the id of the entity, or its unique name
  // - `return` The requested `Entity` or `undefined`
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

  // ### Remove an entity
  // Schedules the given object to be deleted on the next frame.
  // Will cause `destruct` to be called on all components of the object before it is deleted.

  // `void Space.removeEntity(arg)`

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

  // `void TANK.removeAllEntities()`

  // Equivalent to calling `Space.removeEntity` on every entity. Schedules all entities for deletion.
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

  // ### Find components with a given interface
  // Gets all component instances that implement a particular interface.

  // `Array<Component> Space.getComponentsWithInterface(interfaceName)`

  // - `interfaceName` Name of the interface that returned components should implement.
  // - `return` An array of component instances.
  TANK.Space.prototype.getComponentsWithInterface = function (interfaceName)
  {
    return this._interfaceComponents[interfaceName];
  };

  // ### Send out an event
  // Takes any number of arguments after event name.

  // `void Space.dispatchEvent(eventName)`

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

  TANK.Space.prototype.clearDeletedObjects = function ()
  {
    // Delete pending objects
    for (var i in this._objectsDeleted)
    {
      var obj = this._objectsDeleted[i];
      obj.destruct();
      delete this._objects[obj.id];
      delete this._objectsNamed[obj.name];
      obj.id = -1;
      obj.name = "Deleted";
    }
    this._objectsDeleted = [];
  }

  TANK.Space.prototype.update = function (dt)
  {
    if (this.paused)
      return;

    this.dispatchEvent("OnEnterFrame", dt);
  }

}(this.TANK = this.TANK ||
{}));
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
//
//
// An entity is a generic object which is primarily a container
// for components. Most things in your game will be entities.
(function (TANK)
{
  "use strict";

  // ### Entity constructor
  // Shouldn't really ever be called except interally by the engine.
  // Instead use `TANK.createEntity()`.
  //
  // - `id`: ID to give the Entity.
  TANK.Entity = function (id)
  {
    this.name = null;
    this.id = id;
    this._components = {};
    this._initialized = false;
  };

  // ### Add a component
  // Adds a component to the entity, which invokes the component's
  // constructor.
  //
  // - `componentName`: The name of the component to add.
  // - `return`: The entity.
  TANK.Entity.prototype.addComponent = function (componentName)
  {
    if (this[componentName])
    {
      return this;
    }

    // Get the component definition object
    var componentDef = TANK._registeredComponents[componentName];
    if (!componentDef)
    {
      TANK.error("No component registered with name " + componentName);
      return this;
    }

    // Temporarily add a fake component just to mark this one as added
    // for the upcoming recursive calls
    this[componentName] = "Placeholder";
    this._components[componentName] = "Placeholder";

    // Add all the included components
    var i;
    for (i = 0; i < componentDef._includes.length; ++i)
    {
      this.addComponent(componentDef._includes[i]);
    }

    // Clone the component into our list of components
    var component = componentDef.clone();
    this[componentName] = component;
    this._components[componentName] = component;
    component.construct();
    component._constructed = true;
    component.parent = this;

    // For dynamically added components the entity will have
    // already been added to the engine, so we need to make
    // sure to initialize them immediately
    if (this._initialized)
    {
      component.initialize();
    }

    return this;
  };

  // ### Add multiple components
  // Adds a collection of components to the entity.
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  // e.g., `addComponents("Pos2D, Velocity", "Image", "Collider");`
  //
  // - `return`: The entity.
  TANK.Entity.prototype.addComponents = function ()
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

    return this;
  };

  // ### Remove a component
  // Removes a component from the entity, invoking the component's
  // destructor.
  //
  // - `componentName`: The name of the component to remove.
  // - `return`: The entity.
  TANK.Entity.prototype.removeComponent = function (componentName)
  {
    // If we don't have the component then just return
    var c = this[componentName];
    if (!c)
    {
      return;
    }

    // Inform the engine this component was uninitialized
    TANK.dispatchEvent("OnComponentUninitialized", c);

    // Uninitialize the component
    c.destruct();

    // Remove all remaining event listeners
    var i, j, obj, listeners;
    for (i = 0; i < c._listeners.length; ++i)
    {
      obj = c._listeners[i];
      listeners = TANK._events[obj.evt];
      for (j = 0; listeners && j < listeners.length; ++j)
      {
        if (listeners[j].self === obj.self && listeners[j].func === obj.func)
        {
          listeners.splice(j, 1);
          break;
        }
      }
    }

    // Stop tracking this component by its interfaces
    var componentDef = TANK._registeredComponents[componentName];
    for (i = 0; i < componentDef._interfaces.length; ++i)
    {
      // Get the list of components with this interface
      var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];

      if (componentList)
      {
        delete componentList[this.name + "." + componentDef.name];
      }
    }

    // Remove component
    delete this._components[componentName];
    delete this[componentName];
  };

  // ### Invoke a method on the entity.
  // Attempts to invoke the given method name on each component
  // contained in the entity. Components that do not contain
  // the method are skipped. Any additional parameters given
  // will be passed to the invoked function.
  //
  // - `funcName`: The name of the method to invoke.
  // - `return`: The entity.
  TANK.Entity.prototype.invoke = function (funcName)
  {
    // Construct arguments
    var message_args = [];
    var i;
    for (i = 1; i < arguments.length; ++i)
    {
      message_args.push(arguments[i]);
    }

    // Invoke on each component
    for (i in this._components)
    {
      if (this._components.hasOwnProperty(i) && this._components[i][funcName] && this._components[i][funcName].apply)
      {
        this._components[i][funcName].apply(this._components[i], message_args);
      }
    }

    return this;
  };

  // ### Uninitialize an entity
  // Removes all components on the entity, invoking their destructors.
  // Rarely needed outside the engine, more commonly
  // you will want to remove the entity with `TANK.removeEntity()`.
  //
  // `return`: The entity.
  TANK.Entity.prototype.destruct = function ()
  {
    var i;
    for (i in this._components)
    {
      if (this._components.hasOwnProperty(i))
      {
        this.removeComponent(i);
      }
    }

    return this;
  };

}(this.TANK = this.TANK ||
{}));
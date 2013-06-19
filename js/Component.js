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
// A component defines a small module of functionality and is
// initialized by adding it to an `Entity`.
(function (TANK)
{
  "use strict";

  // ### Component constructor
  // Shouldn't really ever be called outside the engine.
  // If you are trying to register a new type of component,
  // use `TANK.registerComponent()`. If you are trying to add
  // a component to an entity, use `Entity.addComponent()`.
  //
  // name - The name of the component type.
  TANK.Component = function (name)
  {
    this.name = name;
    this._functions = {};
    this._includes = [];
    this._interfaces = [];
  };

  // ### Instantiate a component
  // Creates a component object from this blueprint.
  // Will rarely be necessary to call outside the engine, as
  // this is dealt with internally in the `addComponent()` methods.
  //
  // - `return`: The new component object.
  TANK.Component.prototype.clone = function ()
  {
    var c = {};

    // Default functions
    c.construct = function () {};
    c.initialize = function () {};
    c.destruct = function () {};

    // Add interfaces
    c.interfaces = {};
    var i;
    for (i = 0; i < this._interfaces.length; ++i)
    {
      c.interfaces[this._interfaces[i]] = true;
    }

    // Add functions
    for (i in this._functions)
    {
      if (this._functions.hasOwnProperty(i))
      {
        c[i] = this._functions[i];
      }
    }

    // Set properties
    c.name = this.name;
    c._constructed = false;
    c.addEventListener = this.addEventListener;
    c.removeEventListener = this.removeEventListener;

    c._listeners = [];

    return c;
  };

  // ### Require other components
  // Defines a list of components that are required by this one
  // and will be automatically added before this one is added.
  // Components can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  //
  // - `return`: A reference to itself.
  TANK.Component.prototype.requires = function ()
  {
    var i, j, arg;
    for (i = 0; i < arguments.length; ++i)
    {
      arg = arguments[i];
      arg = arg.replace(/\s/g, "");
      var includes = arg.split(",");

      for (j = 0; j < includes.length; ++j)
      {
        this._includes.push(includes[i]);
      }
    }

    return this;
  };

  // ### Interfaces
  // Defines a list of interfaces that this component implements.
  // Manager components often look for components that implement a particular interface.
  // Common interfaces include `Drawable2D`, and `Collidable`
  // Interfaces can be given as a string of comma seperated values,
  // a list of strings, or some combination of the above.
  //
  // - `return`: A reference to itself.
  TANK.Component.prototype.interfaces = function ()
  {
    var i, j, arg;
    for (i = 0; i < arguments.length; ++i)
    {
      arg = arguments[i];
      arg = arg.replace(/\s/g, "");
      var interfaces = arg.split(",");

      for (j = 0; j < interfaces.length; ++j)
      {
        this._interfaces.push(interfaces[i]);
      }
    }

    return this;
  };

  // ### Set constructor function
  // Defines a function to be called after the component has been instantiated.
  // This is commonly where you would define member fields with default values.
  //
  // - `func`: A function to call after instantiation.
  // - `return`: A reference to itself.
  TANK.Component.prototype.construct = function (func)
  {
    this._functions.construct = func;
    return this;
  };

  // ### Set init function
  // Defines a function to be called after the component has been constructed and added to an entity.
  //
  // - `func`: A function to call upon initialization.
  // - `return`: A reference to itself.
  TANK.Component.prototype.initialize = function (func)
  {
    this._functions.initialize = func;
    return this;
  };

  // ### Set uninit function
  // Defines a function to be called after the component has been removed from an entity.

  //
  // - `func`: A function to call upon uninitialization.
  // - `return`: A reference to itself.
  TANK.Component.prototype.destruct = function (func)
  {
    this._functions.destruct = func;
    return this;
  };

  // ### Listen for an event
  // Registers a callback as a listener for a given event.
  // The event will be removed automatically when the component is
  // destructed.
  //
  // - `event`: The name of the event.
  // - `callback`: A function to call when the event is triggered.
  TANK.Component.prototype.addEventListener = function (event, callback)
  {
    if (!this._constructed)
    {
      TANK.error("The component " + this.name + " tried to listen to " + event + " from `construct`, but should do so from `initialize` instead");
      return;
    }

    if (!callback || !callback.apply)
    {
      TANK.error("The component " + this.name + " tried to listen to " + event + " but did not supply a valid callback");
      return;
    }

    var listeners = TANK._events[event];
    if (!listeners)
    {
      listeners = [];
      TANK._events[event] = listeners;
    }

    this._listeners.push(
    {
      evt: event,
      self: this,
      func: callback
    });

    listeners.push(
    {
      self: this,
      func: callback
    });
  };

  // ### Stop listening for an event
  // Unregisters a callback as a listener for a given event.
  // The event will be removed automatically when the component is
  // destructed.
  //
  // - `event`: The name of the event.
  // - `callback`: The function that was previously registered.
  TANK.Component.prototype.removeEventListener = function (event, callback)
  {
    if (!this._constructed)
    {
      TANK.error("The component " + this.name + " tried to stop listening to " + event + " from `construct`, but should do so from `initialize` instead");
      return;
    }

    if (!callback || !callback.apply)
    {
      TANK.error("The component " + this.name + " tried to stop listening to " + event + " but did not supply a valid callback");
      return;
    }

    var listeners = TANK._events[event],
      i;
    if (!listeners)
    {
      return;
    }

    // Delete the listener from the map
    for (i = 0; i < this._listeners.length; ++i)
    {
      if (this._listeners[i].evt === event && this._listeners[i].func === callback)
      {
        this._listeners.splice(i, 1);
        break;
      }
    }

    for (i = 0; i < listeners.length; ++i)
    {
      if (listeners[i].self === this && listeners[i].func === callback)
      {
        listeners.splice(i, 1);
        break;
      }
    }
  };

}(this.TANK = this.TANK ||
{}));
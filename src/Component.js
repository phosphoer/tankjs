// The MIT License (MIT)
//
// Copyright (c) 2013 David Evans
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

// ## Component
// Components are used to add functionality to Entities.
// Components are defined using `TANK.registerComponent`, not by
// instantiating a Component.
(function(TANK)
{
  "use strict";

  // ## Constructor
  // Never needs to be called externally.
  //
  // `name` - The name of the Component.
  TANK.Component = function(name)
  {
    this._name = name;
    this._includes = [];
    this._construct = function() {};
    this._initialize = function() {};
    this._uninitialize = function() {};
  };

  // ## Include other Components
  // Use this to mark other components that will automatically
  // be added to an Entity that this component is added to.
  // For example a Sprite component would probably include a
  // transform / position component. This method is designed to be
  // chained off of a call to `TANK.registerComponent`
  //
  // `componentNames` - Either an Array of Component names or a single
  // string Component name.
  TANK.Component.prototype.includes = function(componentNames)
  {
    if (!Array.isArray(componentNames))
      componentNames = [componentNames];

    // Copy the array
    this._includes = componentNames.slice();

    return this;
  };

  // ## Define a constructor
  // Define a function that will be called when an instance of
  // the component type is created, such as when it is added to an
  // Entity. This is usually where fields on the component are given
  // default values. This method is designed to be chained off of a call to
  // `TANK.registerComponent`.
  //
  // `func` - A function that will be used to construct the component.
  // The function is invoked with `this` pointing at the component
  // instance.
  TANK.Component.prototype.construct = function(func)
  {
    this._construct = func;
    return this;
  };

  // ## Define an initialize function
  // Define a function that will be called when the entity this component
  // is a part of is initialized. Initialize is usually where custom methods are
  // defined and is where event listeners should be added. This method is designed
  // to be chained off of a call to `TANK.registerComponent`.
  //
  // `func` - A function that will be used to initialize the component.
  // The function is invoked with `this` pointing at the component
  // instance.
  TANK.Component.prototype.initialize = function(func)
  {
    this._initialize = func;
    return this;
  };

  // ## Define an initialize function
  // Define a function that will be called when the entity this component
  // is a part of is initialized. This is where anything done in `initialize`
  // can be undone, if necessary. Note that listeners are already automatically
  // removed when a component is uninitialized. This method is designed to be
  // chained off of a call to `TANK.registerComponent`
  //
  // `func` - A function that will be used to initialize the component.
  // The function is invoked with `this` pointing at the component
  // instance.
  TANK.Component.prototype.uninitialize = function(func)
  {
    this._uninitialize = func;
    return this;
  };

  // ## Clone a component definition.
  // Create a new object representing an instance of the component
  // definition. This never needs to be called externally, as adding
  // a component to an Entity does this internally.
  //
  // `return` - An instance of a component.
  TANK.Component.prototype.clone = function()
  {
    var c = {};

    // Set functions on component
    c.construct = this._construct;
    c.initialize = this._initialize;
    c.uninitialize = this._uninitialize;
    c._uninitializeBase = uninitializeBase;
    c.listenTo = listenTo;
    c.stopListeningTo = stopListeningTo;

    // Add properties on component
    c._name = this._name;
    c._entity = null;
    c._constructed = false;
    c._initialized = false;
    c._listeners = [];

    return c;
  };

  // Base uninitialize function, not called externally.
  var uninitializeBase = function()
  {
    // Remove all listeners
    for (var i = 0; i < this._listeners.length; ++i)
    {
      var evt = this._listeners[i];
      var entityListeners = evt.entity._events[evt.eventName];
      if (!entityListeners)
        continue;

      for (var j = 0; j < entityListeners.length; ++j)
      {
        var entityEvt = entityListeners[j];
        if (entityEvt.self === this)
        {
          entityListeners.splice(j, 1);
          j = entityListeners.length;
        }
      }
    }

    this._listeners = [];
  };

  // ## Listen to an event
  // Register a function to be called when a particular event
  // is disaptched by the given entity. This function is added to
  // each component instance in `clone`.
  //
  // `entity` - The entity to listen for events from. In many cases
  // this will be the `TANK.main` entity.
  //
  // `eventName` - The string name of the event to listen for. All events
  // are case insensitive.
  //
  // `func` - The function to act as the callback for the event. In the callback
  // `this` is set to point at the component instance.
  var listenTo = function(entity, eventName, func)
  {
    eventName = eventName.toLowerCase();
    var evt = {self: this, eventName: eventName, func: func, entity: entity};

    var entityListeners = entity._events[eventName] || [];
    entity._events[eventName] = entityListeners;

    entityListeners.push(evt);
    this._listeners.push(evt);

    return this;
  };

  // ## Stop listening to an event
  // Stop listening to an entity for a particular event.
  // Note that events are automatically removed when a component
  // is uninitialized.
  //
  // `entity` - The entity to stop listening to.
  //
  // `eventName` - The name of the event to stop listening to.
  var stopListeningTo = function(entity, eventName)
  {
    eventName = eventName.toLowerCase();
    var entityListeners = entity._events[eventName];
    if (!entityListeners)
    {
      console.warn("A component tried to stop listening to an event it was not listening to");
      return this;
    }

    // Remove local listener
    for (var i = 0; i < this._listeners.length; ++i)
    {
      var evt = this._listeners[i];
      if (evt.eventName === eventName && evt.entity === entity)
      {
        this._listeners.splice(i, 1);
        break;
      }
    }

    // Remove listener on entity
    for (i = 0; i < entityListeners.length; ++i)
    {
      var entityEvt = entityListeners[i];
      if (entityEvt.self === this)
      {
        entityListeners.splice(i, 1);
        break;
      }
    }
  };

})(this.TANK = this.TANK || {});
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
// A `Component` represents a small piece of funtionality of
// an `Entity`.
(function(TANK)
{
  "use strict";

  // ## Constructor
  // Construct a new `Component` instance based on a `ComponentDef`. This calls
  // the `construct` method defined by the `ComponentDef`.
  //
  // `TANK.ComponentDef componentDef` - The component definition object to use.
  TANK.Component = function(componentDef)
  {
    this._name = componentDef._name;
    this._construct = componentDef._construct;
    this._serialize = componentDef._serialize;
    this._initialize = componentDef._initialize;
    this._uninitialize = componentDef._uninitialize;
    this._entity = null;
    this._constructed = false;
    this._initialized = false;
    this._listeners = [];
    this._construct();
    this._constructed = true;
  };

  // ## Listen to an event
  // Register a function to be called when a particular event
  // is disaptched by the given entity.
  //
  // `entity` - The entity to listen for events from. In many cases
  // this will be the `TANK.main` entity.
  //
  // `eventName` - The string name of the event to listen for. All events
  // are case insensitive.
  //
  // `func` - The function to act as the callback for the event. In the callback
  // `this` is set to point at the component instance.
  TANK.Component.prototype.listenTo = function(entity, eventName, func)
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
  TANK.Component.prototype.stopListeningTo = function(entity, eventName)
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

  // ## Initialize
  // Initializes the component, and calls the `initialize` method
  // defined by the `ComponentDef`.
  TANK.Component.prototype.initialize = function()
  {
    // Track all components on the entity
    if (this._entity && this._entity._parent)
    {
      if (!this._entity._parent._childComponents[this._name])
        this._entity._parent._childComponents[this._name] = {};
      var objectsWithComponent = this._entity._parent._childComponents[this._name];
      objectsWithComponent[this._entity._id] = this._entity;
    }

    this._initialize();
    this._initialized = true;
  };

  // ## Serialize
  // Serializes the component by calling the `serialize` method defined by the
  // `ComponentDef`.
  TANK.Component.prototype.serialize = function(serializer)
  {
    this._serialize(serializer);
  };

  // ## Uninitialize
  // Uninitializes the component, and calls the `uninitialize` method
  // defined by the `ComponentDef`. This removes all listeners previous added.
  TANK.Component.prototype.uninitialize = function()
  {
    // Remove component from tracking
    if (this._entity && this._entity._parent)
    {
      var objectsWithComponent = this._entity._parent._childComponents[this._name];
      delete objectsWithComponent[this._entity._id];
    }

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
    this._uninitialize();
    this._initialized = false;
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);
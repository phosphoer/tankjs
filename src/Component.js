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

(function(TANK)
{
  "use strict";

  TANK.Component = function(name)
  {
    this._name = name;
    this._includes = [];
    this._construct = function() {};
    this._initialize = function() {};
    this._uninitialize = function() {};
  };

  TANK.Component.prototype.includes = function(componentNames)
  {
    if (!Array.isArray(componentNames))
      componentNames = [componentNames];

    // Copy the array
    this._includes = componentNames.slice();

    return this;
  };

  TANK.Component.prototype.construct = function(func)
  {
    this._construct = func;
    return this;
  };

  TANK.Component.prototype.initialize = function(func)
  {
    this._initialize = func;
    return this;
  };

  TANK.Component.prototype.uninitialize = function(func)
  {
    this._uninitialize = func;
    return this;
  };

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

  var listenTo = function(entity, eventName, func)
  {
    var evt = {self: this, eventName: eventName, func: func, entity: entity};

    var entityListeners = entity._events[eventName] || [];
    entity._events[eventName] = entityListeners;

    entityListeners.push(evt);
    this._listeners.push(evt);

    return this;
  };

  var stopListeningTo = function(entity, eventName)
  {
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
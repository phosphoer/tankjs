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

  var _nextId = 0;

  TANK.Entity = function(name)
  {
    this._name = name;
    this._id = _nextId++;
    this._parent = null;
    this._components = {};
    this._componentsOrdered = [];
    this._children = {};
    this._pendingRemove = [];
    this._initialized = false;
    this._events = {};
  };

  TANK.Entity.prototype.addComponent = function(componentNames)
  {
  };

  TANK.Entity.prototype.removeComponent = function(componentNames)
  {
  };

  TANK.Entity.prototype.initialize = function()
  {
    // Initialize every component
    for (var i = 0; i < this._componentsOrdered.length; ++i)
    {
      var c = this._componentsOrdered[i];
      c.initialize();
    }

    this._initialized = true;

    return this;
  };

  TANK.Entity.prototype.uninitialize = function()
  {
    // Uninitialize every component
    for (var i = this._componentsOrdered.length - 1; i >= 0; --i)
    {
      var c = this._componentsOrdered[i];
      c.uninitialize();
    }

    this._initialized = false;

    return this;
  };

  TANK.Entity.prototype.update = function(dt)
  {
    // Remove deleted children
    for (var i = 0; i < this._pendingRemove.length; ++i)
    {
      var id = this._pendingRemove[i].getId();
      var child = this._children[id];
      child.uninitialize();
      delete this._children[id];
    }
    this._pendingRemove = [];

    // Update every component
    for (i = 0; i < this._componentsOrdered.length; ++i)
    {
      this._componentsOrdered[i].update(dt);
    }

    // Update children
    for (i = 0; i < this._children.length; ++i)
    {
      this._children[i].update(dt);
    }

    return this;
  };

  TANK.Entity.prototype.addChild = function(childEntity)
  {
    // Check if entity is already a child of us
    if (childEntity.getParent() === this)
    {
      console.error("An Entity was added to another Entity twice");
      return this;
    }

    // Initialize the child
    childEntity.initialize();

    // Add entity as a child
    this._children[childEntity._id] = childEntity;
    childEntity._parent = this;

    this.dispatchShallowEvent("OnChildAdded", childEntity);

    return this;
  };

  TANK.Entity.prototype.removeChild = function(childEntity)
  {
    // Check if entity is a child
    if (this._children[childEntity._id])
    {
      // Uninitialize and remove child
      childEntity.uninitialize();
      delete this._children[childEntity._id];
      childEntity._parent = null;
    }
    // Error otherwise
    else
    {
      console.error("The Entity being removed is not a child of the calling Entity");
      return this;
    }
  };

  TANK.Entity.prototype.dispatchEvent = function(eventName)
  {
    // Copy arguments and pop off the event name
    var args = arguments.slice(1, arguments.length);

    // Dispatch the event to listeners
    var listeners = this._events[eventName];
    for (var i = 0; i < this.listeners.length; ++i)
    {
      var evt = listeners[i];
      evt.func.apply(evt.self, args);
    }
  };

  TANK.Entity.prototype.dispatchDeepEvent = function(eventName)
  {
    // Dispatch the event normally
    this.dispatchEvent(eventName);

    // Also tell children to dispatch the event
    for (var i in this._children)
      this._children[i].dispatchDeepEvent(eventName);
  };

})(this.TANK = this.TANK || {});
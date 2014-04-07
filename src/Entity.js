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

  TANK.Entity = function(componentNames)
  {
    this._name = null;
    this._id = _nextId++;
    this._parent = null;
    this._components = {};
    this._componentsOrdered = [];
    this._children = {};
    this._namedChildren = {};
    this._childComponents = {};
    this._pendingRemove = [];
    this._initialized = false;
    this._events = {};

    if (componentNames)
      this.addComponent(componentNames);
  };

  TANK.Entity.prototype.addComponent = function(componentNames)
  {
    if (!Array.isArray(componentNames))
      componentNames = [componentNames];

    for (var i = 0; i < componentNames.length; ++i)
    {
      // Skip this component if we already have it
      var componentName = componentNames[i];
      if (this._components[componentName])
        continue;

      // Get component definition
      var componentDef = TANK._registeredComponents[componentName];
      if (!componentDef)
      {
        console.error("No Component is registered with name: " + componentName + ". Did you include it?");
        continue;
      }

      // Add placeholder component to prevent duplicate adds while parsing
      // dependencies
      this._components[componentName] = "Placeholder";
      this[componentName] = "Placeholder";

      // Add component dependencies
      for (var j = 0; j < componentDef._includes.length; ++j)
      {
        this.addComponent(componentDef._includes[j]);
      }

      // Clone the component
      var c = componentDef.clone();
      this._components[componentName] = c;
      this[componentName] = c;
      this._componentsOrdered.push(c);
      c.construct();
      c._constructed = true;
      c._order = this._componentsOrdered.length - 1;
      c._entity = this;

      // Initialize the component immediately if the entity is already initialized
      if (this._initialized)
      {
        if (this._parent)
        {
          if (!this._parent._childComponents[componentName])
            this._parent._childComponents[componentName] = {};
          var objectsWithComponent = this._parent._childComponents[componentName];
          objectsWithComponent[this._id] = c;
        }
        c.initialize();
        c._initialized = true;
        var space = this._parent || this;
        space.dispatchEvent("OnComponentAdded", c);
      }
    }

    return this;
  };

  TANK.Entity.prototype.removeComponent = function(componentNames)
  {
    if (!Array.isArray(componentNames))
      componentNames = [componentNames];

    for (var i = 0; i < componentNames.length; ++i)
    {
      // Skip this component if we don't have it
      var componentName = componentNames[i];
      var c = this._components[componentName];
      if (!c)
        continue;

      // Send out remove event
      var space = this._parent || this;
      space.dispatchEvent("OnComponentRemoved", c);

      // Remove component from tracking
      if (this._parent)
      {
        var objectsWithComponent = this._parent._childComponents[componentName];
        delete objectsWithComponent[this._id];
      }

      // Uninitialize the component
      c._uninitializeBase();
      c.uninitialize();
      c._initialized = false;

      // Remove from map
      delete this[componentName];
      delete this._components[componentName];
      this._componentsOrdered.splice(c._order, 1);
    }

    return this;
  };

  TANK.Entity.prototype.initialize = function()
  {
    var i;
    // Track all components on the entity
    if (this._parent)
    {
      for (i in this._components)
      {
        if (!this._parent._childComponents[i])
          this._parent._childComponents[i] = {};
        var objectsWithComponent = this._parent._childComponents[i];
        objectsWithComponent[this._id] = this;
      }
    }

    // Initialize every component
    for (i = 0; i < this._componentsOrdered.length; ++i)
    {
      var c = this._componentsOrdered[i];
      c.initialize();
      c._initialized = true;
    }

    this._initialized = true;

    return this;
  };

  TANK.Entity.prototype.uninitialize = function()
  {
    var i;
    // Stop tracking all components in the entity
    if (this._parent)
    {
      for (i in this._components)
      {
        var objectsWithComponent = this._parent._childComponents[i];
        delete objectsWithComponent[this._id];
      }
    }

    // Uninitialize every component
    for (i = this._componentsOrdered.length - 1; i >= 0; --i)
    {
      var c = this._componentsOrdered[i];
      var space = this._parent || this;
      space.dispatchEvent("OnComponentRemoved", c);
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
      var id = this._pendingRemove[i]._id;
      var child = this._children[id];
      this.dispatchEvent("OnChildRemoved", child);
      child.uninitialize();
      child._parent = null;
      delete this._children[id];
      delete this._namedChildren[child._name];
    }
    this._pendingRemove = [];

    // Update every component
    for (i = 0; i < this._componentsOrdered.length; ++i)
    {
      if (this._componentsOrdered[i].update)
        this._componentsOrdered[i].update(dt);
    }

    // Update children
    for (i in this._children)
    {
      this._children[i].update(dt);
    }

    return this;
  };

  TANK.Entity.prototype.getChildrenWithComponent = function(componentName)
  {
    return this._childComponents[componentName];
  };

  TANK.Entity.prototype.getChild = function(nameOrId)
  {
    if (nameOrId.substr)
      return this._namedChildren[nameOrId];
    else if (!isNaN(nameOrId))
      return this._children[nameOrId];
  };

  TANK.Entity.prototype.addChild = function(childEntity, name)
  {
    // Check if entity is already a child of us
    if (childEntity._parent === this)
    {
      console.error("An Entity was added to another Entity twice");
      return this;
    }

    // Set name if provided
    if (name)
      childEntity._name = name;

    // Add entity as a child
    this._children[childEntity._id] = childEntity;
    if (childEntity._name)
      this._namedChildren[childEntity._name] = childEntity;
    childEntity._parent = this;

    // Initialize the child
    childEntity.initialize();

    this.dispatchEvent("OnChildAdded", childEntity);

    return this;
  };

  TANK.Entity.prototype.removeChild = function(childEntity)
  {
    // Check if entity is a child
    if (this._children[childEntity._id])
    {
      this._pendingRemove.push(childEntity);
    }
    // Error otherwise
    else
    {
      console.error("The Entity being removed is not a child of the calling Entity");
      return this;
    }

    return this;
  };

  TANK.Entity.prototype.dispatchEvent = function(eventName)
  {
    eventName = eventName.toLowerCase();

    // Copy arguments and pop off the event name
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);

    // Dispatch the event to listeners
    var listeners = this._events[eventName];
    if (!listeners)
      return this;
    for (var i = 0; i < listeners.length; ++i)
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

    return this;
  };

})(this.TANK = this.TANK || {});
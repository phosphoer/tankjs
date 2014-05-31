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

// ## Entity
// An Entity represents a single game object or container. It contains Components
// and children Entities, and can also dispatch events. An Entity's functionality
// is defined by the set of Components it has, and can be used to represent the player,
// an object spawner, a trigger zone, or really just about anything. Since Entities can
// contain child Entities, they can be used to create hierachical structures, or to separate
// portions of your game that have separate behavior, since different Entities can send separate
// events and be paused individually.
(function(TANK)
{
  "use strict";

  // ## Entity Constructor
  // Construct a new Entity object. Takes a Component name
  // or array of Component names to add to the Entity.
  //
  // `[Array<string>, string] componentNames` - Either an Array of Component names or a single
  // string Component name.
  TANK.Entity = function(componentNames)
  {
    this._name = null;
    this._id = -1;
    this._parent = null;
    this._components = {};
    this._componentsOrdered = [];
    this._children = {};
    this._namedChildren = {};
    this._childComponents = {};
    this._pendingRemove = [];
    this._initialized = false;
    this._events = {};
    this._pendingEvents = [];
    this._paused = false;
    this._deleted = false;

    if (componentNames)
      this.addComponent(componentNames);
  };

  // ## Add Component
  // Add a Component to the Entity. This will initialize the Component
  // if the Entity is already initialized, otherwise it will only
  // construct the Component. It will also add Components included by
  // the Component first.
  //
  // `componentNames` - Either an Array of Component names or a single
  // string Component name.
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
      var c = new TANK.Component(componentDef);
      this._components[componentName] = c;
      this[componentName] = c;
      this._componentsOrdered.push(c);
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
        var space = this._parent || this;
        space.dispatch(TANK.Event.componentAdded, c);
      }
    }

    return this;
  };

  // ## Remove Component
  // Remove a Component from the Entity. This will uninitialize the Component.
  //
  // `componentNames` - Either an Array of Component names or a single
  // string Component name.
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
      space.dispatch(TANK.Event.componentRemoved, c);

      // Uninitialize the component
      c.uninitialize();

      // Remove from map
      delete this[componentName];
      delete this._components[componentName];
      this._componentsOrdered.splice(c._order, 1);
    }

    return this;
  };

  // ## Initialize
  // Initialize the Entity. This will call initialize on each
  // Component and child currently added to the Entity, in the order in which
  // they were added. Note that adding an Entity as a child to another
  // initialized Entity will call initialize already, so usually it is not
  // necessary to call this method manually.
  TANK.Entity.prototype.initialize = function()
  {
    // Initialize every component
    var i;
    for (i = 0; i < this._componentsOrdered.length; ++i)
    {
      var c = this._componentsOrdered[i];
      c.initialize();
      var space = this._parent || this;
      space.dispatch(TANK.Event.componentAdded, c);
    }

    // Initialize children
    for (i in this._children)
      this._children[i].initialize();

    this._initialized = true;

    return this;
  };

  // ## Uninitialize
  // Uninitializes every component and child within
  // the Entity.
  TANK.Entity.prototype.uninitialize = function()
  {
    // Uninitialize every component
    var i;
    for (i = this._componentsOrdered.length - 1; i >= 0; --i)
    {
      var c = this._componentsOrdered[i];
      var space = this._parent || this;
      space.dispatch(TANK.Event.componentRemoved, c);
      c.uninitialize();
    }

    // Uninitialize children
    for (i in this._children)
      this._children[i].uninitialize();

    this._initialized = false;

    return this;
  };

  // ## Pause the entity
  TANK.Entity.prototype.pause = function()
  {
    this._paused = true;
  };

  // ## Unpause the entity
  TANK.Entity.prototype.unpause = function()
  {
    this._paused = false;
  };

  // ## Update
  // Runs the update loop on the Entity one time, with the specified
  // dt. This will call update on every Component and child Entity.
  // Calling this method manually could be useful for stepping the update
  // loop once frame at a time.
  //
  // `dt` - The elapsed time, in seconds
  TANK.Entity.prototype.update = function(dt)
  {
    if (this._paused)
      return;

    var i;
    // Remove deleted children
    for (i = 0; i < this._pendingRemove.length; ++i)
    {
      var id = this._pendingRemove[i]._id;
      var child = this._children[id];
      this.dispatch(TANK.Event.childRemoved, child);
      child.uninitialize();
      child._parent = null;
      delete this._children[id];
      delete this._namedChildren[child._name];
    }
    this._pendingRemove = [];

    // Dispatch pending events
    for (i = 0; i < this._pendingEvents.length; ++i)
    {
      // Dispatch the event if it's timer has reached 0
      var pendingEvent = this._pendingEvents[i];
      if (pendingEvent.time <= 0)
      {
        this.dispatch.apply(this, pendingEvent.args);
        this._pendingEvents.splice(i, 1);
        --i;
      }
      else
        pendingEvent.time -= dt;
    }

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

  // ## Get all children with a Component
  // Get every child Entity with a give component. Runs in O(1) time
  // as this information is collected as children are added and removed.
  //
  // `componentName` - Name of the component to match Entities with
  //
  // `return` - An object with Entity IDs mapped to Entities
  TANK.Entity.prototype.getChildrenWithComponent = function(componentName)
  {
    return this._childComponents[componentName];
  };

  // ## Get a child Entity
  // Gets a child Entity with the given name or ID.
  //
  // `nameOrId` - Either the name of the Entity to get, or the ID.
  //
  // `return` - The Entity with the given name or ID, or undefined.
  TANK.Entity.prototype.getChild = function(nameOrId)
  {
    if (nameOrId.substr)
      return this._namedChildren[nameOrId];
    else if (!isNaN(nameOrId))
      return this._children[nameOrId];
  };

  // ## Add a child Entity
  // Add an Entity as a child to this one. The child will be initialized
  // if this Entity is already initialized.
  //
  // `childEntity` - The Entity to add as a child of this one
  //
  // `name` - [Optional] A name to give the added child
  TANK.Entity.prototype.addChild = function(childEntity, name)
  {
    // Check if entity is already a child of us
    if (childEntity._parent === this)
    {
      console.error("An Entity cannot have duplicate children");
      return this;
    }

    // The parent of a child must be initialized
    if (!this._initialized && childEntity._initialized)
    {
      console.error("An initialized Entity cannot have an uninitialized parent");
      return this;
    }

    // It is invalid to add a child that already has a parent
    if (childEntity._parent)
    {
      console.error("An Entity cannot be given multiple parents");
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
    childEntity._deleted = false;

    // Initialize the child if we are initialized
    if (this._initialized)
      childEntity.initialize();

    this.dispatch(TANK.Event.childAdded, childEntity);

    return this;
  };

  // ## Remove a child Entity
  // Remove a child form the Entity. The removal of the child
  // will be deferred to the next frame, at which point the child
  // will be uninitialized.
  //
  // `childEntity` - The child to remove.
  TANK.Entity.prototype.removeChild = function(childEntity)
  {
    // Check if entity is a child
    if (this._children[childEntity._id])
    {
      // Error on double delete
      if (childEntity._deleted)
      {
        console.error("An Entity was deleted twice");
      }
      this._pendingRemove.push(childEntity);
      childEntity._deleted = true;
    }
    // Error otherwise
    else
    {
      console.error("The Entity being removed is not a child of the calling Entity");
      return this;
    }

    return this;
  };

  // ## Dispatch an event to listeners
  // Dispatches an event to all listening Components.
  //
  // `eventName` - The name of the event to dispatch
  //
  // `...args` - Any number of arguments to pass with the event
  TANK.Entity.prototype.dispatch = function(eventName)
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

  // ## Dispatch a deferred event
  // Schedules an event to be dispatched to all listening
  // Components on the next frame.
  //
  // `eventName` - The name of the event to dispatch
  //
  // `...args` - Any number of arguments to pass with the event
  TANK.Entity.prototype.dispatchNextFrame = function(eventName)
  {
    var args = Array.prototype.slice.call(arguments);
    var pendingEvent = {eventName: eventName, args: args, time: 0};
    this._pendingEvents.push(pendingEvent);
  };

  // ## Dispatch a timed event
  // Schedules an event to be dispatched to all listening
  // Components after a specified amount of time.
  //
  // `time` - The time, in seconds, to wait before dispatching
  // the event
  //
  // `eventName` - The name of the event to dispatch
  //
  // `...args` - Any number of arguments to pass with the event
  TANK.Entity.prototype.dispatchTimed = function(time, eventName)
  {
    var args = Array.prototype.slice.call(arguments, 1, arguments.length);
    var pendingEvent = {eventName: eventName, args: args, time: time};
    this._pendingEvents.push(pendingEvent);
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);
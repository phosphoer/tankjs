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

// ## TANK
// The main namespace from which all the features of the engine
// are accessed.
(function(TANK)
{
  "use strict";

  // ## Create the engine
  // Creates the main engine Entity that receives the
  // animation frame callback when `TANK.start()` is called.
  // In a simple project, systems would be attached to this entity,
  // and game objects added as direct children of it. The parameter is
  // passed directly to the constructor of Entity.
  //
  // `componentNames` - Either an Array of Component names or a single
  // string Component name.
  TANK.createEngine = function(componentNames)
  {
    TANK.main = new TANK.Entity(componentNames);
    return TANK;
  };

  // ## Start game loop
  // Begins the main game loop using `requestAnimationFrame`.
  // This also initializes the main engine entity.
  TANK.start = function()
  {
    TANK.main.initialize();
    _running = true;
    update();
    return TANK;
  };

  // ## Stop game loop
  // Sets a flag to not request another animation frame at
  // the end of the next update loop. Note that this is different
  // than pausing an individual entity, as it actually stops the
  // request animation frame loop, whereas pausing simply skips the
  // relevant entity's update call.
  TANK.stop = function()
  {
    _running = false;
  };

  // ## Register a component definition
  // This is the entry point to defining a new type of component.
  // This method should be used over manually instantiating a `ComponentDef`
  // as it performs additional logic to store the definition.
  // The new `ComponentDef` is returned, to enable a return value chained style of defining
  // components.
  //
  // `string componentName` - A string containing a valid identifier to be used as the name of the
  // new Component type.
  //
  // `return` - A new `ComponentDef`.
  TANK.registerComponent = function(componentName)
  {
    var c = new TANK.ComponentDef(componentName);
    TANK._registeredComponents[componentName] = c;
    return c;
  };

  // ## Create an entity
  // Constructs a new `Entity` and adds the given components
  // to it.
  //
  // `[Array<string>, string] componentNames` - Either an Array of Component names or a single
  // string Component name.
  TANK.createEntity = function(componentNames)
  {
    var e = new TANK.Entity(componentNames);
    e._id = _nextId++;
    return e;
  };

  // ## Internal update loop
  function update()
  {
    // Get dt
    var newTime = new Date();
    var dt = (newTime - _lastTime) / 1000.0;
    _lastTime = newTime;
    if (dt > 0.05)
      dt = 0.05;

    // Update main entity
    TANK.main.update(dt);

    // Request next frame
    if (_running)
    {
      // Use RAF in browser
      if (typeof window == "undefined")
        setTimeout(update, 16);
      else
        window.requestAnimationFrame(update);
    }
  }

  var _nextId = 0;
  var _lastTime = 0;
  var _running = false;
  TANK._registeredComponents = {};

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);

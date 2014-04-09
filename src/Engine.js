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
    window.requestAnimationFrame(update);
    _running = true;
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

  // ## Register a compoennt
  // This is the entry point to defining a new type of component.
  // This method should be used over manually instantiating a Component
  // as it performs additional logic to store information about the Component type.
  // The new component is returned, to enable a return value chained style of defining
  // components.
  //
  // `componentName` - A string containing a valid identifier to be used as the name of the
  // new Component type.
  //
  // `return` - A new Component.
  TANK.registerComponent = function(componentName)
  {
    // Component name must be a valid identifier
    if ((componentName[0] >= 0 && componentName[0] <= 9) || componentName.search(" ") >= 0)
    {
      TANK.error(componentName + " is an invalid identifier and won't be accessible without [] operator");
      return this;
    }

    var c = new TANK.Component(componentName);
    TANK._registeredComponents[componentName] = c;
    return c;
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
      window.requestAnimationFrame(update);
  }

  var _lastTime = 0;
  var _running = false;
  TANK._registeredComponents = {};

})(this.TANK = this.TANK || {});

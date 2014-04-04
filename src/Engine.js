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

  // Main engine entity
  TANK.createEngine = function()
  {
    TANK.main = new TANK.Entity();
  };

  // Start the main loop
  TANK.start = function()
  {
    window.requestAnimationFrame(update);
  };

  // Internal update loop
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
    window.requestAnimationFrame(update);
  }

  var _lastTime = 0;

})(this.TANK = this.TANK || {});

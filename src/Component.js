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
    var includes = [componentNames];
    if (Array.isArray(componentNames))
      includes = componentNames;

    // Copy the array
    this._includes = includes.slice();

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
    c.addEventListener = this.addEventListener;
    c.removeEventListener = this.removeEventListener;

    // Add properties on component
    c._name = this._name;
    c._parent = null;
    c._entity = null;
    c._listeners = [];
  };

  TANK.Component.prototype.addEventListener = function(eventName, func)
  {
  };

  TANK.Component.prototype.removeEventListener = function(eventName, func)
  {
  };

})(this.TANK = this.TANK || {});
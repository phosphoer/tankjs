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

// ## Component Definition
// A component definition defines the functionality of a type
// of component.
(function(TANK)
{
  "use strict";

  // ## Constructor
  // Construct a new component definition object.
  //
  // `string name` - The name of the component definition, e.g., "Pos2D".
  TANK.ComponentDef = function(name)
  {
    // Component name must be a valid identifier
    if ((name[0] >= 0 && name[0] <= 9) || name.search(" ") >= 0)
    {
      TANK.error(name + " is an invalid identifier and won't be accessible without [] operator");
    }

    this._name = name;
    this._includes = [];
    this._construct = function() {};
    this._serialize = function() {};
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
  TANK.ComponentDef.prototype.includes = function(componentNames)
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
  TANK.ComponentDef.prototype.construct = function(func)
  {
    this._construct = func;
    return this;
  };

  // ## Define a serialize method
  // Define a function that will be called when the component is
  // serialized (either a read or a write).
  //
  // `func` - A function that will be used to construct the component.
  // The function is invoked with `this` pointing at the component
  // instance. The function takes as a parameter a `Serializer`.
  TANK.ComponentDef.prototype.serialize = function(func)
  {
    this._serialize = func;
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
  TANK.ComponentDef.prototype.initialize = function(func)
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
  TANK.ComponentDef.prototype.uninitialize = function(func)
  {
    this._uninitialize = func;
    return this;
  };

})(typeof exports === "undefined" ? (this.TANK = this.TANK || {}) : exports);
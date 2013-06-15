(function (TankJS, undefined)
{
  "use strict";

  // ### Component object
  // Defines a blueprint for components.
  TankJS.Component = function (name)
  {
    this.name = name;
    this._functions = {};
    this._includes = [];
    this._interfaces = [];
  };

  // ### Instantiate a component
  // Creates a component object from this blueprint.
  //
  // - `return`: The new component object.
  TankJS.Component.prototype.clone = function ()
  {
    var c = {},
      i;

    // Default functions
    c.construct = function () {};
    c.initialize = function () {};
    c.destruct = function () {};

    // Add interfaces
    c.interfaces = {};
    for (i in this._interfaces)
    {
      c.interfaces[this._interfaces[i]] = true;
    }

    // Add functions
    for (i in this._functions)
    {
      c[i] = this._functions[i];
    }

    c.name = this.name;

    return c;
  };

  // ### Require other components
  // Defines a list of components that are required by this one
  // and will be automatically added before this one is added.
  //
  // - `componentNames`: A comma-deliminated string of component names, e.g., "Pos2D, Sprite".
  // - `return`: A reference to itself.
  TankJS.Component.prototype.requires = function (componentNames)
  {
    // Get array of component names
    componentNames = componentNames.replace(/\s/g, "");
    this._includes = componentNames.split(",");

    return this;
  };

  // ### Interfaces
  // Defines a list of interfaces that this component implements.
  // Manager components often look for components that implement a particular interface.
  // Common interfaces include `Drawable2D`, and `Collidable`
  //
  // - `interfaces`: A comma-deliminated string of interface names, e.g., "Drawable2D, Collidable".
  // - `return`: A reference to itself.
  TankJS.Component.prototype.interfaces = function (interfaces)
  {
    // Get array of interface names
    interfaces = interfaces.replace(/\s/g, "");
    this._interfaces = interfaces.split(",");
    return this;
  };

  // ### Set constructor function
  // Defines a function to be called after the component has been instantiated.
  // This is commonly where you would define member fields with default values.
  // The function will be called such that the `this` variable points to the component instance.
  //
  // - `func`: A function to call after instantiation.
  // - `return`: A reference to itself.
  TankJS.Component.prototype.construct = function (func)
  {
    this._functions.construct = func;
    return this;
  };

  // ### Set init function
  // Defines a function to be called after the component has been constructed and added to a game object.
  // The function will be called such that the `this` variable points to the component instance.
  //
  // - `func`: A function to call upon initialization.
  // - `return`: A reference to itself.
  TankJS.Component.prototype.initialize = function (func)
  {
    this._functions.initialize = func;
    return this;
  };

  // ### Set uninit function
  // Defines a function to be called after the component has been removed from a game object.
  // The function will be called such that the `this` variable points to the component instance.
  //
  // - `func`: A function to call upon uninitialization.
  // - `return`: A reference to itself.
  TankJS.Component.prototype.destruct = function (func)
  {
    this._functions.destruct = func;
    return this;
  };

  // ### Set a custom function
  // Defines a custom-named function to be added to the component.
  // The function will be called such that the `this` variable points to the component instance.
  //
  // - `func`: A function object.
  // - `return`: A reference to itself.
  TankJS.Component.prototype.addFunction = function (name, func)
  {
    this._functions[name] = func;
    return this;
  };

}(this.TankJS = this.TankJS ||
{}));
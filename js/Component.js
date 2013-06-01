(function (TankJS, undefined)
{

TankJS.Component = function(name)
{
  this.name = name;
  this._functions = {};
  this._includes = [];
  this._tags = [];
}

TankJS.Component.prototype.clone = function()
{
  var c = {};

  // Default functions
  c.init = function() {};
  c.uninit = function() {};

  // Add tags
  c.tags = {};
  for (var i in this._tags)
    c.tags[this._tags[i]] = true;

  // Add functions
  for (var i in this._functions)
  {
    c[i] = this._functions[i];
  }

  // Set properties
  c.name = this.name;

  return c;
}

// Define a list of components that are required by this one
TankJS.Component.prototype.includes = function(componentNames)
{
  // Get array of component names
  componentNames = componentNames.replace(/\s/g, "");
  this._includes = componentNames.split(",");

  return this;
}

TankJS.Component.prototype.tags = function(tagNames)
{
  // Get array of tag anmes
  tagNames = tagNames.replace(/\s/g, "");
  this._tags = tagNames.split(",");
  return this;
}

// Define the initialization function for this component
TankJS.Component.prototype.initFunction = function(func)
{
  this._functions.init = func;
  return this;
}

// Define the uninitialization function for this component
TankJS.Component.prototype.uninitFunction = function(func)
{
  this._functions.uninit = func;
  return this;
}

// Add a custom named function to the component
TankJS.Component.prototype.addFunction = function(name, func)
{
  this._functions[name] = func;
  return this;
}

} (window.TankJS = window.TankJS || {}));
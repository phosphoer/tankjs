(function (TankJS, undefined)
{

TankJS.GameObject = function(id)
{
  // Name of the game object
  this.name = "GameObject " + id;

  // ID of the game object
  this.id = id;

  // Map of components by component name
  this._components = {};

  // Map of components by component tag
  this._taggedComponents = {};
}

TankJS.GameObject.prototype.remove = function()
{
  TankJS.removeObject(this.id);
}

TankJS.GameObject.prototype.addComponent = function(componentName)
{
  // Check if we have this component already
  if (this.getComponent(componentName))
    return;

  // Get the component definition object
  var componentDef = TankJS._components[componentName];

  // Temporarily add a fake component just to mark this one as added
  // for the upcoming recursive calls
  this._components[componentName] = "Placeholder";

  // Add all the included components
  for (var i in componentDef._includes)
  {
    this.addComponent(componentDef._includes[i]);
  }

  // Clone the component into our list of components
  var c = componentDef.clone();
  this._components[componentName] = c;

  // Track this component by its tags
  for (var i in componentDef._tags)
  {
    // Get the list of components with this tag
    var componentList = TankJS._taggedComponents[componentDef._tags[i]];
    var componentListLocal = this._taggedComponents[componentDef._tags[i]];
    if (!componentList)
    {
      componentList = {};
      TankJS._taggedComponents[componentDef._tags[i]] = componentList;
    }
    if (!componentListLocal)
    {
      componentListLocal = {};
      this._taggedComponents[componentDef._tags[i]] = componentListLocal;
    }

    componentList[this.name + "." + componentDef.name] = c;
    componentListLocal[componentDef.name] = c;
  }

  // Set some attributes of the component instance
  c.parent = this;

  // Initialize the component
  c.init.apply(c);

  // Inform the engine this component was initialized
  TankJS.dispatchEvent("OnComponentInitialized", c);

  return this;
}

TankJS.GameObject.prototype.addComponents = function(componentNames)
{
  // Get array of component names
  componentNames = componentNames.replace(/\s/g, "");
  var components = componentNames.split(",");

  // Add components to object
  for (var i in components)
  {
    this.addComponent(components[i]);
  }

  return this;
}

TankJS.GameObject.prototype.removeComponent = function(componentName)
{
  // If we don't have the component then just return
  var c = this.getComponent(componentName);
  if (!c)
    return;

  // Inform the engine this component was uninitialized
  TankJS.dispatchEvent("OnComponentUninitialized", c);

  // Uninitialize the component
  c.uninit.apply(c);

  // Stop tracking this component by its tags
  var componentDef = TankJS._components[componentName];
  for (var i in componentDef._tags)
  {
    // Get the list of components with this tag
    var componentList = TankJS._taggedComponents[componentDef._tags[i]];
    var componentListLocal = this._taggedComponents[componentDef._tags[i]];

    if (componentList)
      delete componentList[this.name + "." + componentDef.name];
    if (componentListLocal)
      delete componentListLocal[componentDef.name];
  }

  // Remove component
  delete this._components[componentName];
}

TankJS.GameObject.prototype.getComponent = function(componentName)
{
  return this._components[componentName];
}

TankJS.GameObject.prototype.getComponentsWithTag = function(tagName)
{
  return this._taggedComponents[tagName];
}

TankJS.GameObject.prototype.invoke = function(funcName, args)
{
  // Construct arguments
  var message_args = [];
  for (var i = 1; i < arguments.length; ++i)
    message_args.push(arguments[i]);

  // Invoke on each component
  for (var i in this._components)
  {
    if (this._components[i][funcName])
      this._components[i][funcName].apply(this._components[i], message_args);
  }
}

TankJS.GameObject.prototype.attr = function(componentName, attrs)
{
  var c = this.getComponent(componentName);
  if (!c)
    return;

  for (var i in attrs)
    c[i] = attrs[i];

  return this;
}

TankJS.GameObject.prototype.uninit = function()
{
  // Remove all components
  for (var i in this._components)
  {
    this.removeComponent(i);
  }
}

} (window.TankJS = window.TankJS || {}));
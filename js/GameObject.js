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
    if (!componentList)
    {
      componentList = {};
      TankJS._taggedComponents[componentDef._tags[i]] = componentList;
    }

    componentList[this.name + "." + componentDef.name] = c;
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
    if (!componentList)
      continue;

    delete componentList[this.name + "." + componentDef.name];
  }

  // Remove component
  delete this._components[componentName];
}

TankJS.GameObject.prototype.getComponent = function(componentName)
{
  return this._components[componentName];
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
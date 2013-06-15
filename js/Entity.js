(function (TANK, undefined)
{

  TANK.Entity = function (id)
  {
    // Name of the game object
    this.name = null;

    // ID of the game object
    this.id = id;

    // Map of components by name
    this._components = {};
  }

  TANK.Entity.prototype.remove = function ()
  {
    TANK.removeObject(this.id);
  }

  TANK.Entity.prototype.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (this[componentName])
      return this;

    // Get the component definition object
    var componentDef = TANK._registeredComponents[componentName];
    if (!componentDef)
    {
      TANK.error("No component registered with name " + componentName);
      return this;
    }

    // Temporarily add a fake component just to mark this one as added
    // for the upcoming recursive calls
    this[componentName] = "Placeholder";
    this._components[componentName] = "Placeholder";

    // Add all the included components
    for (var i in componentDef._includes)
    {
      this.addComponent(componentDef._includes[i]);
    }

    // Clone the component into our list of components
    var c = componentDef.clone();
    this[componentName] = c;
    this._components[componentName] = c;

    // Set some attributes of the component instance
    c.parent = this;

    // Initialize the component
    c.construct.apply(c);

    return this;
  }

  TANK.Entity.prototype.addComponents = function (componentNames)
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

  TANK.Entity.prototype.removeComponent = function (componentName)
  {
    // If we don't have the component then just return
    var c = this[componentName];
    if (!c)
      return;

    // Inform the engine this component was uninitialized
    TANK.dispatchEvent("OnComponentUninitialized", c);

    // Uninitialize the component
    c.destruct.apply(c);

    // Stop tracking this component by its interfaces
    var componentDef = TANK._registeredComponents[componentName];
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];

      if (componentList)
        delete componentList[this.name + "." + componentDef.name];
    }

    // Remove component
    delete this._components[componentName];
    delete this[componentName];
  }

  TANK.Entity.prototype.invoke = function (funcName, args)
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

  TANK.Entity.prototype.attr = function (componentName, attrs)
  {
    var c = this[componentName]
    if (!c)
    {
      TANK.error("Could not find component with name " + componentName);
      return this;
    }

    for (var i in attrs)
      c[i] = attrs[i];

    return this;
  }

  TANK.Entity.prototype.destruct = function ()
  {
    // Remove all components
    for (var i in this._components)
    {
      this.removeComponent(i);
    }
  }

}(window.TANK = window.TANK ||
{}));
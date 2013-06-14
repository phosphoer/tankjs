(function (TankJS, undefined)
{

  TankJS.GameObject = function (id)
  {
    // Name of the game object
    this.name = null;

    // ID of the game object
    this.id = id;

    // Map of components by name
    this._components = {};
  }

  TankJS.GameObject.prototype.remove = function ()
  {
    TankJS.removeObject(this.id);
  }

  TankJS.GameObject.prototype.addComponent = function (componentName)
  {
    // Check if we have this component already
    if (this[componentName])
      return this;

    // Get the component definition object
    var componentDef = TankJS._components[componentName];
    if (!componentDef)
    {
      TankJS.error("No component registered with name " + componentName);
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

    // Track this component by its interaces
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TankJS._interfaceComponents[componentDef._interfaces[i]];
      if (!componentList)
      {
        componentList = {};
        TankJS._interfaceComponents[componentDef._interfaces[i]] = componentList;
      }

      componentList[this.name + "." + componentDef.name] = c;
    }

    // Set some attributes of the component instance
    c.parent = this;

    // Initialize the component
    c.construct.apply(c);

    return this;
  }

  TankJS.GameObject.prototype.addComponents = function (componentNames)
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

  TankJS.GameObject.prototype.removeComponent = function (componentName)
  {
    // If we don't have the component then just return
    var c = this[componentName];
    if (!c)
      return;

    // Inform the engine this component was uninitialized
    TankJS.dispatchEvent("OnComponentUninitialized", c);

    // Uninitialize the component
    c.destruct.apply(c);

    // Stop tracking this component by its interfaces
    var componentDef = TankJS._components[componentName];
    for (var i in componentDef._interfaces)
    {
      // Get the list of components with this interface
      var componentList = TankJS._interfaceComponents[componentDef._interfaces[i]];

      if (componentList)
        delete componentList[this.name + "." + componentDef.name];
    }

    // Remove component
    delete this._components[componentName];
    delete this[componentName];
  }

  TankJS.GameObject.prototype.invoke = function (funcName, args)
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

  TankJS.GameObject.prototype.attr = function (componentName, attrs)
  {
    var c = this[componentName]
    if (!c)
    {
      TankJS.error("Could not find component with name " + componentName);
      return this;
    }

    for (var i in attrs)
      c[i] = attrs[i];

    return this;
  }

  TankJS.GameObject.prototype.destruct = function ()
  {
    // Remove all components
    for (var i in this._components)
    {
      this.removeComponent(i);
    }
  }

}(window.TankJS = window.TankJS ||
{}));
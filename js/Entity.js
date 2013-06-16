(function (TANK)
{
  "use strict";

  TANK.Entity = function (id)
  {
    this.name = null;
    this.id = id;
    this._components = {};
    this._initialized = false;
  };

  TANK.Entity.prototype.addComponent = function (componentName)
  {
    if (this[componentName])
    {
      return this;
    }

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
    var i;
    for (i = 0; i < componentDef._includes.length; ++i)
    {
      this.addComponent(componentDef._includes[i]);
    }

    // Clone the component into our list of components
    var component = componentDef.clone();
    this[componentName] = component;
    this._components[componentName] = component;

    component.parent = this;

    component.construct();

    // For dynamically added components the entity will have 
    // already been added to the engine, so we need to make
    // sure to initialize them immediately
    if (this._initialized)
    {
      component.initialize();
    }

    return this;
  };

  TANK.Entity.prototype.addComponents = function ()
  {
    // Components can be given as a string of comma seperated values,
    // or a list of strings, or some combination of the above
    var i, j, arg;
    for (i = 0; i < arguments.length; ++i)
    {
      arg = arguments[i];
      arg = arg.replace(/\s/g, "");
      var components = arg.split(",");

      for (j = 0; j < components.length; ++j)
      {
        this.addComponent(components[j]);
      }
    }

    return this;
  };

  TANK.Entity.prototype.removeComponent = function (componentName)
  {
    // If we don't have the component then just return
    var c = this[componentName];
    if (!c)
    {
      return;
    }

    // Inform the engine this component was uninitialized
    TANK.dispatchEvent("OnComponentUninitialized", c);

    // Uninitialize the component
    c.destruct();

    // Remove all remaining event listeners
    var i, j, obj, listeners;
    for (i = 0; i < c._listeners.length; ++i)
    {
      obj = c._listeners[i];
      listeners = TANK._events[obj.evt];
      for (j = 0; listeners && j < listeners.length; ++j)
      {
        if (listeners[j].self === obj.self && listeners[j].func === obj.func)
        {
          listeners.splice(j, 1);
          break;
        }
      }
    }

    // Stop tracking this component by its interfaces
    var componentDef = TANK._registeredComponents[componentName];
    for (i = 0; i < componentDef._interfaces.length; ++i)
    {
      // Get the list of components with this interface
      var componentList = TANK._interfaceComponents[componentDef._interfaces[i]];

      if (componentList)
      {
        delete componentList[this.name + "." + componentDef.name];
      }
    }

    // Remove component
    delete this._components[componentName];
    delete this[componentName];
  };

  TANK.Entity.prototype.invoke = function (funcName, args)
  {
    // Construct arguments
    var message_args = [];
    var i;
    for (i = 1; i < arguments.length; ++i)
    {
      message_args.push(arguments[i]);
    }

    // Invoke on each component
    for (i in this._components)
    {
      if (this._components.hasOwnProperty(i) && this._components[i][funcName])
      {
        this._components[i][funcName].apply(this._components[i], message_args);
      }
    }
  };

  TANK.Entity.prototype.destruct = function ()
  {
    var i;
    for (i in this._components)
    {
      if (this._components.hasOwnProperty(i))
      {
        this.removeComponent(i);
      }
    }
  };

}(this.TANK = this.TANK ||
{}));
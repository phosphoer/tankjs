(function (TankJS, undefined)
{

// Map of objects tracked by the core
// Key is the id of the object
TankJS._objects = {};

// Map of current registered component types
// Key is the name of the component
TankJS._components = {};

// Current ID for game objects
TankJS._currentID = 0;

TankJS.addObject = function(componentsString)
{
  // Create the object
  var obj = new TankJS.GameObject();
  obj._id = TankJS._currentID++;

  // Get array of component names
  componentsString = componentsString.replace(/\s/g, "");
  var components = componentsString.split(",");

  // Add components to object
  for (var i in components)
  {
    var componentInstance = new TankJS._components[components[i]]();
    obj.addComponent(componentInstance);
  }
}

function update()
{
  // Get dt
  var new_time = new Date();
  var dt = (new_time - TomatoJS.Core.last_time) / 1000.0;
  if (dt > 0.05)
    dt = 0.05;

  requestAnimFrame(this);
}

} (window.TankJS = window.TankJS || {}));
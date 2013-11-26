// Super amazing, cross browser property function, based on http://thewikies.com

function addProperty(obj, name, onGet, onSet)
{

  // wrapper functions
  var
  oldValue = obj[name],
    getFn = function ()
    {
      return onGet.apply(obj, [oldValue]);
    },
    setFn = function (newValue)
    {
      return oldValue = onSet.apply(obj, [newValue]);
    };

  // Modern browsers, IE9+, and IE8 (must be a DOM object),
  if (Object.defineProperty)
  {

    Object.defineProperty(obj, name,
    {
      get: getFn,
      set: setFn
    });

    // Older Mozilla
  }
  else if (obj.__defineGetter__)
  {

    obj.__defineGetter__(name, getFn);
    obj.__defineSetter__(name, setFn);

    // IE6-7
    // must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
  }
  else
  {

    var onPropertyChange = function (e)
    {

      if (event.propertyName == name)
      {
        // temporarily remove the event so it doesn't fire again and create a loop
        obj.detachEvent("onpropertychange", onPropertyChange);

        // get the changed value, run it through the set function
        var newValue = setFn(obj[name]);

        // restore the get function
        obj[name] = getFn;
        obj[name].toString = getFn;

        // restore the event
        obj.attachEvent("onpropertychange", onPropertyChange);
      }
    };

    obj[name] = getFn;
    obj[name].toString = getFn;

    obj.attachEvent("onpropertychange", onPropertyChange);

  }
}
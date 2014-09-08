(function()
{
  'use strict';

  TANK.registerComponent('Resources')
  .construct(function()
  {
    this._resourcesToLoad = {};
    this._resourcesLoaded = 0;
    this._resources = {};
    this._queuedResources = [];
  })

  .initialize(function()
  {
    //
    // Add a resource to be loaded
    //
    this.add = function(name, path, dependencies, loader)
    {
      this._resourcesToLoad[name] =
      {
        name: name,
        path: path,
        dependencies: dependencies || [],
        loader: loader
      };
    };

    //
    // Get a resource by name
    //
    this.get = function(name)
    {
      return this._resources[name];
    };

    //
    // Get a map of all resources
    //
    this.getAll = function()
    {
      return this._resources;
    };

    //
    // Load all queued resources
    //
    this.load = function()
    {
      for (var i in this._resourcesToLoad)
        this._loadResource(this._resourcesToLoad[i], true);
    };

    this._resourceLoaded = function(res, loadedRes)
    {
      // Mark resource as loaded
      this._resources[res.name] = loadedRes;
      ++this._resourcesLoaded;
      res.loaded = true;

      // Dispatch done event when all resources loaded
      var numResources = Object.keys(this._resourcesToLoad).length;
      if (this._resourcesLoaded >= numResources)
      {
        this._entity.dispatch('resourcesloaded');
        return;
      }

      // Check if we can load any of our queued resources now
      for (var i = 0; i < this._queuedResources.length; ++i)
        this._loadResource(this._queuedResources[i], false);
    };

    this._loadResource = function(res, addToQueue)
    {
      // Skip if done
      if (res.loaded)
      {
        return;
      }

      // Check if all dependencies are loaded
      var dependenciesMet = true;
      for (var i = 0; i < res.dependencies.length; ++i)
      {
        var dep = this._resourcesToLoad[res.dependencies[i]];
        if (!dep.loaded)
          dependenciesMet = false;
      }

      // If not, add this resource to the queue for later
      if (!dependenciesMet)
      {
        if (addToQueue)
        {
          this._queuedResources.push(res);
        }
        return;
      }

      // Otherwise, we can now load the resource
      if (res.loader)
      {
        res.loader(res.name, res.path, this, function(loadedRes)
        {
          this._resourceLoaded(res, loadedRes);
        }.bind(this));
      }
      else if (res.path)
      {
        if (res.path.search(/(.png|.jpg|.jpeg|.gif)/) >= 0)
        {
          var img = new Image();
          img.src = res.path;
          img.onload = function()
          {
            this._resourceLoaded(res, img);
          }.bind(this);
        }
      }
    };
  });
})();
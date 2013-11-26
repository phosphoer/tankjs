// Main entry point
function main()
{
  // Create an entity
  var myEntity = TANK.createEntity("MyComponent");

  // Add the entity to TANK, and name it
  TANK.addEntity(myEntity, "My Entity");

  // Start the engine
  TANK.start();
}


// Register a new component type
TANK.registerComponent("MyComponent")

.construct(function()
{
  this.elapsedTime = 0;
  console.log(this.name + " was constructed");
})

.initialize(function()
{
  console.log(this.name + " was initialized in " + this.parent.name);

  // Let's add a method to our component
  // This function will be our event handler for the OnEnterFrame
  // event. The OnEnterFrame event passes dt (delta time) in seconds.
  this.update = function(dt)
  {
    this.elapsedTime += dt;
    console.log("elapsed seconds: " + this.elapsedTime);

    // Let's send our timeout event after 0.1 seconds
    if (this.elapsedTime >= 0.1)
    {
      // Let's send out a message saying that our component ran out of time
      // We could pass additional arguments to give to the event handlers, but we
      // don't have any.
      // Messages are sent instantly, so our outOfTime function will be called
      // before we return from this function
      // Also note that any component can listen for this message, it is sent globally.
      TANK.dispatchEvent("OnTimeOut");
    }
  };

  // Let's use another method to handle our own custom event
  // This is a little over architected but it is just to show
  // how you dispatch your own events.
  this.outOfTime = function()
  {
    this.removeEventListener("OnEnterFrame", this.update);

    // Try replacing the removeEventListener with this line and see how
    // the event also stops getting called
    // TANK.removeEntity(this.parent);
  }

  // Now let's add an event listener for OnEnterFrame
  // addEventListener is a default method on all components,
  // which takes the event name, and then a function to call.
  this.addEventListener("OnEnterFrame", this.update);

  // Let's also listen for our custom event
  this.addEventListener("OnTimeOut", this.outOfTime);
})

.destruct(function()
{
  // We don't need to call remove event listener here because
  // components automatically remove their event listeners on destruct!

  console.log(this.name + " is being destructed");
});
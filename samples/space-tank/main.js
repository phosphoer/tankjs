'use strict';

// Main function which is called from the html
function main()
{
  // Create the main engine entity and add some components to it
  // Components on the main entity are usually 'system' components
  // that work with collections of entities or do other non-individual
  // things
  TANK.createEngine(['EnemySpawner', 'Input', 'CollisionManager', 'Renderer2D']);

  // Set the context of the renderer component from our canvas
  // And also set an initial camera y
  TANK.main.Renderer2D.context = document.querySelector('#canvas').getContext('2d');
  TANK.main.Renderer2D.camera.y = -200;

  // Start the main loop, which also initializes the TANK.main entity
  TANK.start();

  // Create the player entity using the Player component
  var e = TANK.createEntity('Player');
  TANK.main.addChild(e);

  // Create the ground entity, and name it Level so we
  // can find it later
  e = TANK.createEntity('Ground');
  TANK.main.addChild(e, 'Level');
}

// Defining a simple component in this file for laziness reasons
// Components are defined with return value chaining syntax
TANK.registerComponent('EnemySpawner')

// Define the constructor with a function that sets some initial values
.construct(function()
{
  this.spawnTimer = 5;
})
// Define the initialize function that gets called when the component's
// entity is added
.initialize(function()
{
  // The update function can be implemented to gain access to the main loop
  // dt is in seconds
  this.update = function(dt)
  {
    this.spawnTimer -= dt;

    if (this.spawnTimer <= 0)
    {
      // Spawn a new entity with the Enemy component and set some attributes
      // on its components.
      // Note that the Pos2D component was included even though not specified
      // because the Enemy component requires it
      var e = TANK.createEntity('Enemy');
      e.Pos2D.x = TANK.main.Renderer2D.camera.x + window.innerWidth / 2;
      e.Pos2D.y = -250 - Math.random() * 200;
      TANK.main.addChild(e);
      this.spawnTimer = 3 + Math.random() * 5;
    }
  };
});
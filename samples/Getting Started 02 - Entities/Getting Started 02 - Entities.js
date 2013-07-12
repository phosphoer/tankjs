// Main entry point
function main()
{
  // Create an entity
  var myEntity = TANK.createEntity();

  // Add the entity to TANK, and name it
  TANK.addEntity(myEntity, "My Entity");

  // Get the entity
  var alsoMyEntity = TANK.getEntity("My Entity");

  // Now remove the entity
  // Here we could have also passed in the name, or the entity's id (myEntity.id)
  TANK.removeEntity(myEntity);
}
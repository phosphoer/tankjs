// Main entry point
function main()
{
  // Create an entity that has MyComponent as a component on it
  // TANK.createEntity() takes a list of components names as a parameter
  // like "MyComponent, Health, AnotherComponent"
  var myEntity = TANK.createEntity("MyComponent");

  // Could also do this instead, which takes the same parameter
  // myEntity.addComponents("MyComponent");

  // Add the entity to TANK, and name it
  TANK.addEntity(myEntity, "My Entity");

  // This time we'll actually start the engine, because we want to see what happens
  // when we delete the entity
  TANK.start();

  // Get the entity
  var alsoMyEntity = TANK.getEntity("My Entity");

  // Check a value on our component
  console.log("Value of a field on the component instance: " + alsoMyEntity.MyComponent.aField);

  // Now remove the entity
  // Here we could have also passed in the name, or the entity's id (myEntity.id)
  TANK.removeEntity(myEntity);
}

// Let's register a new component type!
// In TANK, this is done via first a function call to TANK,
// and then a bunch of method calls on the returned Component object.

// Remember that we are defining a new *type* of component, or a "blueprint"
// of sorts. We are not dealing with an actual instance of a component here!

// Also note that the name of the component type must be a valid identifier, as
// you'll be accessing it from your entity as a member field.
TANK.registerComponent("MyComponent")

// To make the syntax more readable, I usually put each function call on the next line
// even though it looks kind of weird.
// Just remember that each of the following functions is being called on the return of TANK.registerComponent()

// Here we could list which components are required for this one to operate.
// Components we list here will be automatically added before this one, so that we
// can rely on their existence in our initialize function.
// We haven't defined any other components so I'll leave it commented
// .requires("Health, AnotherComponent")

// Here we can define which interfaces our component implements
// Interfaces are basically "tags" given to a component.
// There are no defined interfaces, but we might decide that all components with a
// draw function will have the "Drawable" interface
.interfaces("Drawable")

// The ".construct()" function takes the function to call on the component as a
// parameter, and defines how the component constructs itself. This is where you should
// add any member fields you wish your component to have. Construct is called once
// the component is added to an entity.
.construct(function()
{
  // TANK handles the "this" pointer for you such that it always points to the
  // component instance in these anonymous functions
  this.aField = 5;
  this.anotherField = "blah";

  // Components have a "name" field which is equal to the type name of the component
  // or "MyComponent" in this case.
  console.log(this.name + " was constructed");
})

// Now we'll define how the component initializes itself.
// This function is called once the parent entity is added to the engine with
// "TANK.addEntity()".
// This is a good place to add event listeners, write custom methods, and interact
// with other components on the parent entity.
.initialize(function()
{
  // All components also have a "parent" field which points to the parent entity.
  // The parent field is not valid until initialize is called.
  // Entities have a name field too!
  // Default fields of components and entities are always read only.
  // If you change them, weird things might happen.
  console.log(this.name + " was initialized in " + this.parent.name);

  // Maybe if we had another component on our parent called "Health" we'd want to
  // set one of our fields differently.
  // Don't store references to sibling components! If you remove the component later at
  // runtime, it will cause you headaches!
  if (this.parent.Health)
    this.aField = 3;

  // Let's add a method to our component
  this.myMethod = function()
  {
    // In here our "this" pointer is still valid, so we can still access our fields
    this.anotherField = "changed";

    console.log("Custom method!");
  };
})

// Finally, we'll define how this component destructs itself
// We haven't actually done anything that we need to clean up in this example,
// but I'm just going to call my custom method to show the functionality.
// Note this line has a semi-colon because we are finally done with our super
// long statement that started with registerComponent!
.destruct(function()
{
  // Call our custom method
  this.myMethod();

  console.log(this.name + " is being destructed");
});
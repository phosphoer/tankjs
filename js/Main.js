function main()
{
  TankJS.addComponent("Sprite")
        .initFunction(function()
        {
          console.log(this.name + " initialized in " + this.parent.name);
          TankJS.addEventListener("TestEvent", this.myFunction, this);
        })
        .addFunction("myFunction", function(arg)
        {
          console.log("Custom function in " + this.parent.name + " with argument: " + arg);
        });

  TankJS.addComponent("Platformer")
        .includes("Sprite")
        .initFunction(function()
        {
          console.log(this.name + " initialized in " + this.parent.name);
        })
        .uninitFunction(function()
        {
          console.log(this.name + " uninitialized in " + this.parent.name);
        });

  TankJS.addObject("Player").addComponents("Platformer");

  TankJS.dispatchEvent("TestEvent", "poop");

  TankJS.removeNamedObject("Player");
}
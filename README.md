![logo](http://i.imgur.com/fktNU1A.png)
*TANK Engine is ze best engine for programmers.*

TANK is a lightweight Javascript engine framework focused on the following ideas:

- Modular
- Small
- No dependencies
- Made for programmers

TANK is still in early development, but it is already usable! To get started, pull the repository and take a look at the `samples/` directory. More documentation will be written as the framework matures. TANK is similar to [Crafty](http://craftyjs.com/) but strives to be more flexible, and is more of a *framework* than an engine.

#Features
The goal of TANK is to provide a simple framework that removes some of the tedious tasks of making small games. The framework doesn't provide any game functionality like graphics or physics, but instead provides an architecture on top of which such features can be easily built. Additionally, some components have already been written which can render to an HTML5 canvas / do collision resolution, and are available as a separate download.

###Core Engine
The core engine is very small, and provides 3 main objects.

- TANK: The main interface through which all the functionality of the engine is accessed.
- Space: A collection of Entities, a self contained "world"
- Entity: A container for components with methods to manipulate them.
- Component: Used to define a "blueprint" of a component that can be added to an Entity or Space. Components can choose to implement "interfaces" which are used to define what sort of functionality they provide. For example, the `RenderManager` component looks for components that implement 'Drawable' and calls `draw` on them.

###Components
Most of the engine functionality is achieved through components. The set of components that you choose to include determines the graphics, physics, and other capabilities of your game.

For example, there is already an `Image` component which draws an image on a given HTML5 canvas, and a `RenderManager` component which takes care of drawing `Image` components for you.

One of the simplest components available is the `Pos2D` component, which allows an Entity to have an x and y position, and rotation.

    TANK.registerComponent("Pos2D")
        .construct(function()
        {
          this.x = 0;
          this.y = 0;
          this.rotation = 0;
        });

This snippet registers a `Component` type named `Pos2D`. In the `construct` function it defines an x, y, and rotation field for the component. For more examples, look in the `samples/` directory.



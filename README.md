#TankJS
A lightweight Javascript game framework focused on the following ideas:

- Modular
- Small
- No dependencies

TankJS is still in early development, but it is already usable! To get started, pull the repository and take a look at the `samples/` directory. More documentation will be written as TankJS matures. TankJS is similar to [Crafty](http://craftyjs.com/) but strives to be more flexible.

#Features
The goal of TankJS is to provide  a simple framework that removes some of the tedious tasks of making small games. There are two parts to TankJS, the core engine, and then additional components that provide all the game-making functionality.

###Core Engine
The core engine is very small, and provides 3 main objects.

- TankJS: The main interface through which all the functionality of the engine is accessed.
- GameObject: A container for components with methods to manipulate them.
- Component: Used to define a "blueprint" of a component that can be added to a GameObject. Components can be given "tags" which are used to define what sort of functionality they provide. For example, the `RenderManager` component looks for components with the `Drawable` tag and draws them.

###Components
Most of the engine functionality is achieved through extra components that are either custom-made or come with the engine. The set of components that you choose to include determines the graphics, physics, and other capabilities of your game.

For example, TankJS comes with a `Canvas` component which provides an HTML5 canvas to perform drawing on, an `Image` component which draws an image on a given canvas, and a `RenderManager` component which takes care of drawing `Image` components for you.

One of the simplest components in TankJS is the `Pos2D` component, which allows a GameObject to have an x and y position, and rotation.

    TankJS.registerComponent("Pos2D")
    .initFunction(function()
    {
      this.x = 0;
      this.y = 0;
      this.rotation = 0;
    });

This snippet registers a `Component` type named `Pos2D`. In the `init` function it defines an x, y, and rotation field for the component. For more examples, look in the `samples/` directory.
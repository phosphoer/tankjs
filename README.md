![logo](http://i.imgur.com/fktNU1A.png)

TANK is a lightweight Javascript engine framework focused on the following ideas:

- Modular
- Small
- No dependencies
- Made for programmers

TANK is still in early development, but it is already usable! To get started, pull the repository and take a look at the `samples/` directory. More documentation will be written as the framework matures. TANK is similar to [Crafty](http://craftyjs.com/) but strives to be more flexible, and is more of a *framework* than an engine.

#Features

###Components
Rather than using an inheritance tree, TANK uses a component-based architecture. In this model, you write lots of small, modular components that can be attached to any object to create custom behaviors quickly.

### Entities
An Entity at its heart is simply a container for components. Most things in your game will be an entity with some assortment of components attached to it.

### Events
All Components can listen for Events. For example, TANK send out an `OnEnterFrame` event every frame that Components can listen to in order to be part of the main loop.

### No Setup
TANK doesn't require a node install, a local server, dependencies, or anything beyond double-clicking your HTML file to run it.



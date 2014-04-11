[![Build Status](https://travis-ci.org/phosphoer/TankJS.svg)](https://travis-ci.org/phosphoer/TankJS)

TANK is a lightweight Javascript engine framework focused on the following ideas:

- Modular
- Small
- Made for programmers

TANK is still in early development, but it is already usable! To get started, pull the repository and take a look at the `samples/` directory, or read the [docs](http://phosphoer.github.io/TankJS). More documentation will be written as the framework matures. TANK is similar to [Crafty](http://craftyjs.com/) but strives to be more flexible, and is more of a *framework* than an engine.

#Features

###Components
Rather than using an inheritance tree, TANK uses a component-based architecture. In this model, you write lots of small, modular components that can be attached to any object to create custom behaviors quickly.

### Entities
An Entity at its heart is simply a container for components. Most things in your game will be an entity with some assortment of components attached to it.

### Events
All Components can listen to Entities for events. For example, each Entity will dispatch the 'childadded' event when a child is added.

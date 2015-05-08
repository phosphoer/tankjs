[![Build Status](https://travis-ci.org/phosphoer/tankjs.svg)](https://travis-ci.org/phosphoer/tankjs)

# TANK

A lightweight Javascript engine framework focused on the following ideas:

- Modular
- Small
- Made for programmers

To get started, pull the repository and take a look at the `samples/` directory, or read the [docs](https://github.com/phosphoer/TankJS/wiki). More documentation will be written as the framework matures. 

# Features

### Components
Rather than using an inheritance tree, TANK uses a component-based architecture. In this model, you write lots of small, modular components that can be attached to any object to create custom behaviors quickly. A component's logic can very quite a bit in scope, such as a simple position component that just has `x` and `y` fields, to a complex renderer that handles drawing and sorting other drawable components.

### Entities
An Entity is a generic object whose behavior is defined by the collection of components attached to it. It also may contain child entities which receive updates when it does. Most 'things' in your game will be entities, whether it is a barrel on the ground, a trigger zone, or something more abstract like the object that manages the AI of your strategy game. 

### Events
All Components can listen to Entities for events. For example, each Entity will dispatch the 'childadded' event when a child is added to it. Events can be dispatched immediately, next frame, or after a certain timeout. 

# Building
Before you can run the sample projects, you'll need to build TankJS. Building requires [NodeJS](http://nodejs.org/).
```
$ git clone http://github.com/phosphoer/TankJS.git
$ cd TankJS
$ sudo npm install -g gulp
$ npm install
$ gulp
```

If you don't wish to install `gulp` globally, you should also be able to install it locally and run it from the `node_modules/` directory.

```
$ cd TankJS
$ npm install
$ node_modules/.bin/gulp
```

# Run tests
```
$ npm test
```

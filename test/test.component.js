(function()
{
  "use strict";
  var TANK = require("../bin/tank.js");
  var chai = require("chai");
  var expect = chai.expect;

  describe("TANK.Component", function()
  {
    var def = TANK.registerComponent("ComponentTest")
    .construct(function() {this.blah = 5;})
    .initialize(function()
    {
      this.listener = function(arg)
      {
        expect(arg).to.equal(42);
      };

      this.otherListener = function()
      {
      };

      this.listenTo(TANK.main, "TestEvent", this.listener);
      this.listenTo(TANK.main, "TestEvent2", this.otherListener);
      this.blah = 6;
    })
    .uninitialize(function() {this.blah = 7;});

    describe("constructor()", function()
    {
      it("should take functions from TANK.ComponentDef", function()
      {
        var c = new TANK.Component(def);
        expect(c).to.have.property("_construct");
        expect(c).to.have.property("_initialize");
        expect(c).to.have.property("_uninitialize");
        expect(c).to.have.property("initialize");
        expect(c).to.have.property("uninitialize");
        expect(c).to.have.property("listenTo");
        expect(c).to.have.property("stopListeningTo");
        expect(c._construct).to.equal(def._construct);
        expect(c._initialize).to.equal(def._initialize);
        expect(c._uninitialize).to.equal(def._uninitialize);
      });

      it("should return an Object with the Component properties", function()
      {
        var c = new TANK.Component(def);
        expect(c).to.have.property("_name");
        expect(c).to.have.property("_entity");
        expect(c).to.have.property("_constructed");
        expect(c).to.have.property("_initialized");
        expect(c).to.have.property("_listeners");
        expect(c._name).to.equal("ComponentTest");
        expect(c._entity).to.be.null;
        expect(c._constructed).to.be.true;
        expect(c._initialized).to.be.false;
        expect(c._listeners).to.be.empty;
      });
    });

    describe("initialize()", function()
    {
      it("should call internal initialize function", function()
      {
        var c = new TANK.Component(def);
        c.initialize();
        expect(c._initialize).to.be.called;
      });
    });

    describe("listenTo()", function()
    {
      it("should add a listener to _listeners", function()
      {
        var e = TANK.createEntity();
        e.addComponent("ComponentTest");
        TANK.main.addChild(e);
        expect(e.ComponentTest._listeners[0]).to.not.be.undefined;
        expect(e.ComponentTest._listeners[0].self).to.equal(e.ComponentTest);
        expect(e.ComponentTest._listeners[0].eventName).to.equal("testevent");
        expect(e.ComponentTest._listeners[0].entity).to.equal(TANK.main);
        TANK.main.removeChild(e);
      });

      it("should correctly get the listener invoked", function()
      {
        var e = TANK.createEntity();
        e.addComponent("ComponentTest");
        TANK.main.addChild(e);
        TANK.main.dispatch("TestEvent", 42);
        expect(e.ComponentTest.listener).to.be.called;
        TANK.main.removeChild(e);
      });
    });

    describe("stopListeningTo()", function()
    {
      var c = TANK.registerComponent("StopListeningToTest")
      .initialize(function()
      {
        this.listenTo(TANK.main, "TestEvent2", function(done, arg)
        {
          chai.assert.throw();
        });
        this.stopListeningTo(TANK.main, "TestEvent2");
      });

      it("should stop listener from being called", function()
      {
        var e = TANK.createEntity();
        e.addComponent("ComponentTest");
        TANK.main.addChild(e);
        e.ComponentTest.stopListeningTo(TANK.main, "TestEvent2");
        TANK.main.dispatch("TestEvent2");
        expect(e.ComponentTest.otherListener).to.not.be.called;
        TANK.main.removeChild(e);
      });
    });
  });
})();
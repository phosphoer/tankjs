(function()
{
  "use strict";
  var expect = chai.expect;

  describe("TANK", function()
  {
    describe("createEngine()", function()
    {
      it("should create main Entity", function()
      {
        TANK.createEngine();
        expect(TANK.main).to.be.a.instanceOf(TANK.Entity);
      });
    });

    describe("registerComponent()", function()
    {
      it("should add a Component defintion", function()
      {
        TANK.registerComponent("TestComponent");
        var def = TANK._registeredComponents.TestComponent;
        expect(TANK._registeredComponents).to.have.property("TestComponent");
        expect(def).to.be.a.instanceOf(TANK.Component);
      });
    });

    describe("start()", function()
    {
      it("should call update() on TANK.main with elapsed time", function(done)
      {
        TANK.start();
        TANK.main.update = function(dt)
        {
          expect(dt).to.be.lessThan(1);
          done();
        };
      });
    });

    describe("stop()", function()
    {
      it("should stop calling update() on TANK.main", function(done)
      {
        TANK.stop();
        var updateCount = 0;
        TANK.main.update = function(dt)
        {
          ++updateCount;
        };
        setTimeout(function()
        {
          expect(updateCount).to.equal(1);
          done();
        }, 30);
      });
    });
  });

  describe("TANK.Entity", function()
  {
    TANK.createEngine();
    TANK.main.initialize();
    describe("constructor()", function()
    {
      it("should set the Entity ID to be >= 0", function()
      {
        var e = new TANK.Entity();
        expect(e._id).to.be.greaterThan(-1);
      });
    });

    describe("addComponent()", function()
    {
      it("should create a property on the Entity", function()
      {
        TANK.registerComponent("AddComponentTest");
        var e = new TANK.Entity();
        e.addComponent("AddComponentTest");
        expect(e).to.have.property("AddComponentTest");
      });

      it("should work with an array of Component names", function()
      {
        TANK.registerComponent("AddComponentTestB");
        var e = new TANK.Entity();
        e.addComponent(["AddComponentTest", "AddComponentTestB"]);
        expect(e).to.have.property("AddComponentTest");
        expect(e).to.have.property("AddComponentTestB");
      });

      it("should not initialize the Component by default", function()
      {
        var e = new TANK.Entity();
        e.addComponent("AddComponentTest");
        expect(e.AddComponentTest._initialized).to.be.false;
      });

      it("should initialize the Component if the Entity is initialized", function()
      {
        var e = new TANK.Entity();
        TANK.main.addChild(e);
        e.addComponent("AddComponentTest");
        expect(e.AddComponentTest._initialized).to.be.true;
      });
    });

    describe("removeComponent()", function()
    {
      it("should remove the property from the Entity", function()
      {
        var e = new TANK.Entity();
        e.addComponent("AddComponentTest");
        e.removeComponent("AddComponentTest");
        expect(e).to.not.have.property("AddComponentTest");
      });

      it("should work with an array as a parameter", function()
      {
        TANK.registerComponent("AddComponentTestB");
        var e = new TANK.Entity();
        e.addComponent(["AddComponentTest", "AddComponentTestB"]);
        e.removeComponent(["AddComponentTest", "AddComponentTestB"]);
        expect(e).to.not.have.property("AddComponentTest");
        expect(e).to.not.have.property("AddComponentTestB");
      });

      it("should uninitialize the component", function(done)
      {
        TANK.registerComponent("RemoveComponentTest")
        .uninitialize(function()
        {
          done();
        });
        var e = new TANK.Entity();
        e.addComponent("RemoveComponentTest");
        var c = e.RemoveComponentTest;
        e.initialize();
        e.removeComponent("RemoveComponentTest");
        expect(c._initialized).to.be.false;
      });
    });
  });

  describe("TANK.Component", function()
  {
    describe("includes()", function()
    {
      it("should work with an array of Component names", function()
      {
        var c = TANK.registerComponent("IncludeTestA").includes(["A", "B"]);
        expect(c._includes).to.be.a.instanceOf(Array);
        expect(c._includes).to.contain("A");
        expect(c._includes).to.contain("B");
      });

      it("should work with a single Component name string", function()
      {
        var c = TANK.registerComponent("IncludeTestB").includes("A");
        expect(c._includes).to.be.a.instanceOf(Array);
        expect(c._includes).to.contain("A");
      });
    });

    describe("clone()", function()
    {
      it("should return an Object with the Component functions", function()
      {
        var c = TANK.registerComponent("CloneTest").clone();
        expect(c).to.have.property("construct");
        expect(c).to.have.property("initialize");
        expect(c).to.have.property("uninitialize");
        expect(c).to.have.property("listenTo");
        expect(c).to.have.property("stopListeningTo");
      });

      it("should return an Object with the Component properties", function()
      {
        var c = TANK.registerComponent("CloneTest2").clone();
        expect(c).to.have.property("_name");
        expect(c).to.have.property("_entity");
        expect(c).to.have.property("_constructed");
        expect(c).to.have.property("_initialized");
        expect(c).to.have.property("_listeners");
        expect(c._name).to.equal("CloneTest2");
        expect(c._entity).to.be.null;
        expect(c._constructed).to.be.false;
        expect(c._initialized).to.be.false;
        expect(c._listeners).to.be.empty;
      });
    });

    describe("listenTo()", function()
    {
      var c = TANK.registerComponent("ListenToTest")
      .initialize(function()
      {
        this.listenTo(TANK.main, "TestEvent", function(done, arg)
        {
          expect(arg).to.equal(5);
          done();
        });
        expect(this._listeners[0]).to.not.be.undefined;
        expect(this._listeners[0].self).to.equal(this);
        expect(this._listeners[0].eventName).to.equal("TestEvent");
        expect(this._listeners[0].entity).to.equal(TANK.main);
      });

      it("should add a listener to _listeners", function()
      {
        var e = new TANK.Entity();
        e.addComponent("ListenToTest");
        TANK.main.addChild(e);
        TANK.main.removeChild(e);
      });

      it("should correctly get the listener invoked", function(done)
      {
        var e = new TANK.Entity();
        e.addComponent("ListenToTest");
        TANK.main.addChild(e);
        TANK.main.dispatchEvent("TestEvent", done, 5);
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
        var e = new TANK.Entity();
        e.addComponent("StopListeningToTest");
        TANK.main.addChild(e);
        TANK.main.dispatchEvent("TestEvent2");
        TANK.main.removeChild(e);
      });
    });
  });
})();
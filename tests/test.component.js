(function()
{
  "use strict";
  var expect = chai.expect;

  describe("TANK.Component", function()
  {
    describe("constructor()", function()
    {
      var def = TANK.registerComponent("ComponentTest")
      .construct(function() {this.blah = 5;})
      .initialize(function() {this.blah = 6;})
      .uninitialize(function() {this.blah = 7;});

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
        expect(this._listeners[0].eventName).to.equal("testevent");
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
        TANK.main.dispatch("TestEvent", done, 5);
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
        TANK.main.dispatch("TestEvent2");
        TANK.main.removeChild(e);
      });
    });
  });
})();
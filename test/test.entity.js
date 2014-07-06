(function()
{
  "use strict";
  var TANK = require("../bin/tank.js");
  var chai = require("chai");
  var expect = chai.expect;

  describe("TANK.Entity", function()
  {
    TANK.createEngine();
    TANK.main.initialize();
    TANK.registerComponent("AddComponentTest");
    TANK.registerComponent("AddComponentTestB");
    describe("constructor()", function()
    {
      it("should set the Entity ID to be -1", function()
      {
        var e = new TANK.Entity();
        expect(e._id).to.equal(-1);
      });
    });

    describe("addComponent()", function()
    {
      it("should create a property on the Entity", function()
      {
        var e = TANK.createEntity();
        e.addComponent("AddComponentTest");
        expect(e).to.have.property("AddComponentTest");
      });

      it("should work with an array of Component names", function()
      {
        var e = TANK.createEntity();
        e.addComponent(["AddComponentTest", "AddComponentTestB"]);
        expect(e).to.have.property("AddComponentTest");
        expect(e).to.have.property("AddComponentTestB");
      });

      it("should not initialize the Component by default", function()
      {
        var e = TANK.createEntity();
        e.addComponent("AddComponentTest");
        expect(e.AddComponentTest._initialized).to.be.false;
      });

      it("should initialize the Component if the Entity is initialized", function()
      {
        var e = TANK.createEntity();
        TANK.main.addChild(e);
        e.addComponent("AddComponentTest");
        expect(e.AddComponentTest._initialized).to.be.true;
      });
    });

    describe("removeComponent()", function()
    {
      it("should remove the property from the Entity", function()
      {
        var e = TANK.createEntity();
        e.addComponent("AddComponentTest");
        e.removeComponent("AddComponentTest");
        expect(e).to.not.have.property("AddComponentTest");
      });

      it("should work with an array as a parameter", function()
      {
        TANK.registerComponent("AddComponentTestB");
        var e = TANK.createEntity();
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
        var e = TANK.createEntity();
        e.addComponent("RemoveComponentTest");
        var c = e.RemoveComponentTest;
        e.initialize();
        e.removeComponent("RemoveComponentTest");
        expect(c._initialized).to.be.false;
      });
    });

    describe("initialize()", function()
    {
      var e = TANK.createEntity(["AddComponentTest", "AddComponentTestB"]);
      TANK.main.addChild(e);

      for (var i = 0; i < 3; ++i)
        e.addChild(TANK.createEntity(["AddComponentTest", "AddComponentTestB"]));

      it("should put self in parent's objects with component map", function()
      {
        expect(TANK.main._childComponents.AddComponentTest).to.include.key(e._id.toString());
        expect(TANK.main._childComponents.AddComponentTestB).to.include.key(e._id.toString());
      });

      it("should initialize all components", function()
      {
        expect(e.AddComponentTest._initialized).to.be.true;
        expect(e.AddComponentTestB._initialized).to.be.true;
      });

      it("should initialize all children", function()
      {
        for (i in e._children)
          expect(e._children[i]._initialized).to.be.true;
      });
    });
  });
})();
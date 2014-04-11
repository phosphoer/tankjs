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
      var def = null;
      it("should add a Component defintion", function()
      {
        TANK.registerComponent("TestComponent");
        def = TANK._registeredComponents.TestComponent;
        expect(TANK._registeredComponents).to.have.property("TestComponent");
        expect(def).to.be.a.instanceOf(TANK.ComponentDef);
      });
      it("should name the Component definition", function()
      {
        expect(def).to.have.property("_name");
        expect(def._name).to.equal("TestComponent");
      });

    });

    describe("createEntity()", function()
    {
      it("should construct an Entity and set its ID", function()
      {
        var e = TANK.createEntity();
        expect(e).to.be.a.instanceOf(TANK.Entity);
        expect(e._id).to.be.greaterThan(-1);
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
      it("should initialize TANK.main", function()
      {
        expect(TANK.main._initialized).to.be.true;
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
})();
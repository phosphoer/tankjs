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
        expect(def).to.be.a.instanceOf(TANK.ComponentDef);
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
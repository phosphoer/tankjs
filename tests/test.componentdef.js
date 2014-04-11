(function()
{
  "use strict";
  var expect = chai.expect;

  describe("TANK.ComponentDef", function()
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
  });
})();
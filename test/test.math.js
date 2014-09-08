(function()
{
  "use strict";
  var TANK = require("../bin/tank.js");
  var chai = require("chai");
  var expect = chai.expect;

  describe("TANK.Math2D", function()
  {
    describe("pointDistanceLine", function()
    {
      it("should work with line segments", function()
      {
        var a = [0, 0];
        var b = [1, 0];
        var c = [3, 0];
        var dist = TANK.Math2D.pointDistanceLine(c, a, b, true);
        expect(dist).to.equal(2);

        c = [-2, 0];
        dist = TANK.Math2D.pointDistanceLine(c, a, b, true);
        expect(dist).to.equal(2);

        c = [0.5, 2];
        dist = TANK.Math2D.pointDistanceLine(c, a, b, true);
        expect(dist).to.equal(2);

        a = [0, 0];
        b = [0, 1];
        c = [0.5, 0.5];
        dist = TANK.Math2D.pointDistanceLine(c, a, b, true);
        expect(dist).to.equal(0.5);
      });

      it("should work with lines", function()
      {
        var a = [0, 0];
        var b = [1, 0];
        var c = [300, 2];
        var dist = TANK.Math2D.pointDistanceLine(c, a, b);
        expect(dist).to.equal(2);
      });
    });

  });
})();
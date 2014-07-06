(function()
{
  "use strict";
  var TANK = require("../bin/tank.js");
  var chai = require("chai");
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

      it("should recursively add included Components, handling circular references", function()
      {
        TANK.registerComponent("IncludeTestC").includes("IncludeTestD");
        TANK.registerComponent("IncludeTestD").includes(["IncludeTestE", "IncludeTestF"]);
        TANK.registerComponent("IncludeTestE").includes("IncludeTestC");
        TANK.registerComponent("IncludeTestF");
        var e = TANK.createEntity("IncludeTestC");
        expect(e).to.have.property("IncludeTestC");
        expect(e).to.have.property("IncludeTestD");
        expect(e).to.have.property("IncludeTestE");
        expect(e).to.have.property("IncludeTestF");
      });
    });

    describe("construct()", function()
    {
      it("should set the _construct function", function()
      {
        var func = function() {};
        var c = new TANK.ComponentDef("ComponentDefTest").construct(func);
        expect(c._construct).to.equal(func);
      });
    });

    describe("initialize()", function()
    {
      it("should set the _initialize function", function()
      {
        var func = function() {};
        var c = new TANK.ComponentDef("ComponentDefTest").initialize(func);
        expect(c._initialize).to.equal(func);
      });
    });

    describe("uninitialize()", function()
    {
      it("should set the _uninitialize function", function()
      {
        var func = function() {};
        var c = new TANK.ComponentDef("ComponentDefTest").uninitialize(func);
        expect(c._uninitialize).to.equal(func);
      });
    });

  });
})();
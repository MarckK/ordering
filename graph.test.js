const Graph = require("./graph");

const demand = require("must");
describe("Graph", () => {
  it("should return a single element", () => {
    const g = new Graph();

    g.add("cheese");
    const result = g.toArray();

    demand(result).be.eql(["cheese"]);
  });

  it("should return two elements", () => {
    const g = new Graph();

    g.add("cheese");
    g.add("pickle");

    const result = g.toArray();
    demand(result).be.eql(["cheese", "pickle"]);
  });

  it("should return elements in dependency order", () => {
    const g = new Graph();

    g.add("cheese", "pickle");
    g.add("pickle");

    const result = g.toArray();
    demand(result).be.eql(["pickle", "cheese"]);
  });

  it("should return many elements in dependency order", () => {
    const g = new Graph();

    g.add("cheese", "pickle");
    g.add("pickle", "jam");
    g.add("jam");

    const result = g.toArray();
    demand(result).be.eql(["jam", "pickle", "cheese"]);
  });

  it("should resolve items with two dependencies", () => {
    const g = new Graph();

    g.add("cheese", ["pickle", "jam"]);
    g.add("pickle");
    g.add("jam");

    const result = g.toArray();
    demand(result).be.eql(["pickle", "jam", "cheese"]);
  });

  describe("impossible dependency chains", () => {
    it("should throw exception if object with needed dependency added without the required dependency", () => {
      const g = new Graph();

      g.add("cheese", "impossible");

      let threw = false;
      try {
        g.toArray();
      } catch (exception) {
        threw = true;
      }
      demand(threw).must.be.true();
    });

    it("should throw exception if cyclic dependency chain", () => {
      const g = new Graph();

      g.add("cheese", "pickle");
      g.add("pickle", "jam");
      g.add("jam", "cheese");

      let threw = false;
      try {
        g.toArray();
      } catch (exception) {
        threw = true;
      }
      demand(threw).must.be.true();
    });
  });
});

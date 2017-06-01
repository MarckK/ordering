// this uses Mocha and Must.j

const Graph = require("./graph");

const demand = require("must");
describe("Graph", () => {
  it("should return a single element", () => {
    //arrange
    const g = new Graph();

    //act,
    g.add("cheese");
    //assert
    const result = g.toArray();
    demand(result).be.eql(["cheese"]);
  });

  it("should return two elements", () => {
    //arrange
    const g = new Graph();

    //act,
    g.add("cheese");
    g.add("pickle");
    //assert
    const result = g.toArray();
    demand(result).be.eql(["cheese", "pickle"]);
  });

  it("should return elements in dependency order", () => {
    //arrange
    const g = new Graph();

    //act,
    g.add("cheese", "pickle");
    g.add("pickle");
    //assert
    const result = g.toArray();
    demand(result).be.eql(["pickle", "cheese"]);
  });

  it("should return many elements in dependency order", () => {
    //arrange
    const g = new Graph();

    //act,
    g.add("cheese", "pickle");
    g.add("pickle", "jam");
    g.add("jam");
    //assert
    const result = g.toArray();
    demand(result).be.eql(["jam", "pickle", "cheese"]);
  });

  it("should resolve items with two dependencies", () => {
    //arrange
    const g = new Graph();

    //act,
    g.add("cheese", ["pickle", "jam"]);
    g.add("pickle");
    g.add("jam");
    //assert
    const result = g.toArray();
    demand(result).be.eql(["pickle", "jam", "cheese"]);
    //OK, but we have a problem, because when demand equal was ["jam", "pickle", "cheese"], it failed. This seems a small issue, since dependencies are met in each case, but I think we need to make the ordering really secure?
  });

  describe("impossible dependency chains", () => {
    it("should throw exception if object with needed dependency added without the required dependency", () => {
      //arrange
      const g = new Graph();

      //act,
      g.add("cheese", "impossible");
      //assert
      let threw = false;
      try {
        g.toArray();
      } catch (exception) {
        threw = true;
      }
      demand(threw).must.be.true();
    });

    it("should throw exception if cyclic dependency chain", () => {
      //arrange
      const g = new Graph();

      //act,
      g.add("cheese", "pickle");
      g.add("pickle", "jam");
      g.add("jam", "cheese");
      //assert
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

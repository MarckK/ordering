class Graph {
  constructor() {
    this.items = [];
  }
  add(name, dependentOn) {
    this.items.push({ name, dependentOn });
  }
  toArray() {
    const results = [];
    const temp = new Set(this.items);

    while (temp.size) {
      let size = temp.size;
      temp.forEach(item => {
        // console.log(item.dependentOn);
        let adm = false;
        let hasNoDependency = false;
        let dependencyMet = false;
        if (item.dependentOn === undefined) {
          hasNoDependency = true;
        } else if (item.dependentOn.constructor === Array) {
          if (allDependenciesMet(results, item.dependentOn)) adm = true;
        } else {
          //check if results holding a dependency that an item in temp needs
          dependencyMet = results.includes(item.dependentOn);
        }
        if (hasNoDependency || dependencyMet || adm) {
          results.push(item.name);
          temp.delete(item);
        }
      });
      if (size === temp.size) {
        throw new Error("Cannot resolve dependency chain.");
      }
    }
    return results;
  }
}

function allDependenciesMet(results, dependentOn) {
  let flag = true;
  dependentOn.forEach(dependency => {
    if (!results.includes(dependency)) flag = false;
  });
  return flag;
}

module.exports = Graph;

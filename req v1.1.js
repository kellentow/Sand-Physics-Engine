// Version 1.1
var required = {};
var loaded = {};

var req = {
  add: function(name, version) {
    if (!required[name] || version > required[name]) {
      required[name] = version;
    }
  },
  load: function(name, version) {
    if (!loaded[name] || version > loaded[name]) {
      loaded[name] = version;
    }
  },
  log: function() {
    console.log("Loaded: " + JSON.stringify(loaded));
    console.log("Required: " + JSON.stringify(required));

    var outdatedDependencies = Object.keys(required).filter(name => 
      !loaded[name] || (loaded[name] < required[name])
    );

    if (outdatedDependencies.length > 0) {
      var updatesNeeded = outdatedDependencies.map(name => 
        name + " (minimum version: " + required[name] + ")"
      );
      console.log("Outdated Dependencies: " + updatesNeeded.join(", "));
    } else {
      console.log("All dependencies are up to date.");
    }
  }
};

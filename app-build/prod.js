const Build = require("./build");

Build.cleanAppJS()
.then(Build.cleanCSS)
.then(Build.createAppJS)
.then(Build.createContentCSS);
require("../build");
Libs.taskHelpers.compileApps()
  .then(Libs.server.start);

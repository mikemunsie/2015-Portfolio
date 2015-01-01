(function() {

  var dependencies = [
    "angularTemplates2JS",
    "LocalStorageModule",
    "ngCookies",
    "ngRoute",
    "toaster",
    "ngMaterial",
    "ngRoute",
    "components_dataModel",
    "components_iconFill",
    "components_materialButtons",
    "components_header",
    "components_d3pie",
    "components_budget",
    "components_profile"
  ];

  angular
    .module("layouts_default", dependencies, function($interpolateProvider) {
      $interpolateProvider.startSymbol('[[');
      $interpolateProvider.endSymbol(']]');
    });

})();

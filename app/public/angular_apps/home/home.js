(function() {

  // Import Views
  require("../../angular_views/home");
  require("../../angular_views/budget");
  require("../../angular_views/profile");
  require("../../angular_views/edit");

  var dependencies = [
    "views_home",
    "views_budget",
    "views_profile",
    "views_edit",
    "ngRoute"
  ];

  angular
    .module("app-home", dependencies)
    .config(homeConfig);

  function homeConfig($interpolateProvider, $routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "/public/angular_views/home/html/home.html"
      })
      .when('/budget', {
        templateUrl: "/public/angular_views/budget/html/budget.html"
      })
      .when('/profile', {
        templateUrl: "/public/angular_views/profile/html/profile.html"
      })
      .when('/edit', {
        templateUrl: "/public/angular_views/edit/html/edit.html"
      })
      .otherwise({
        redirectTo: "/"
      });
  }

})();
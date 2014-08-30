angular.module("components.auth", ["components.session"])
.constant("AUTH_EVENTS", {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});
angular.module("components.auth")
  .factory("components.auth.service", [
    "$http",
    "components.session.service",
    function($http, sessionService){
      var authService = {};

      authService.getUser = function(){
        return sessionService.getUser();
      };

      authService.authorizeCheck = function(next, $location){
        if(next.authorization){
          if(!authService.isAuthorized()) $location.url("/");
        }
      };

      authService.isAuthorized = function(){
        return sessionService.getUser().sessionId !== null;
      };

      authService.logout = function(){
        sessionService.remove();
      };

      authService.login = function(credentials){
        return $http
          .get('/', credentials)
          .then(function(response){
            sessionService.create(credentials);
          }, function(response){

          });
      };
  
      return authService;
    }
  ]);
angular.module("components.login", [
  "components.registration",
  "components.auth",
  "ngRoute"
]);
angular.module("components.login")
  .controller("components.login.controller", [
    "$scope",
    "components.registration.service",
    "components.auth.service",
    "$location",
    function($scope, registrationService, authService, $location){

      function login(){
        authService.login($scope.credentials);
      }

      function redirectToDashboard(){
        $location.url("/dashboard");
      }

      $scope.redirectToDashboard = redirectToDashboard;
      $scope.welcomeText = "Login Controller";
      $scope.login = login;
      $scope.credentials = {
        username: "",
        password: ""
      };

    }
  ]);
angular.module("components.registration", []);
angular
  .module("components.registration")
  .factory("components.registration.service", function(){
    this.test = "Sweetness";
    return this;
  });
angular.module("components.registration")
  .controller("components.registration.controller", ["$scope", "components.registration.service", function($scope, $components_registrationService){
    $scope.welcomeText = "Registration!! - " + $components_registrationService.test;
  }]);
angular.module("components.session", ["LocalStorageModule"]);
angular.module("components.session")
.factory("components.session.service", [
  "localStorageService",
  function(localStorageService){

    var user = {
      username: null,
      sessionId: null
    };

    function init(){
      if(localStorageService.get('user')){
        user = localStorageService.get('user');
      }
    }

    this.getUser = function(){
      return user;
    };

    this.create = function(credentials){
      user.sessionId = "someMadeUpSession";
      user.username = credentials.username;
      localStorageService.set("user", user);
    };

    this.remove = function(){
      localStorageService.clearAll();
      user.username = null;
      user.sessionId = null;
    };

    init();
    return this;
  }
]);
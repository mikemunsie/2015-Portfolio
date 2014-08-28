(function(module) {
try {
  module = angular.module('componentsAndViewsHTMLToJS');
} catch (e) {
  module = angular.module('componentsAndViewsHTMLToJS', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/public/angular-components/login/login.html',
    '<div class="component-login" ng-controller="components.login.controller"><div ng-show="!$root.isAuthorized()"><form ng-submit="login()"><h1>Login Component</h1>Username:<br><input type="text" ng-model="credentials.username"><br>Password:<br><input type="password" ng-model="credentials.password"><br><input type="submit" value="Login"></form></div><div ng-show="$root.isAuthorized()">Hello [[$root.user().username]]!<br>You are authorized!<br><br><a href="javascript:;" ng-click="redirectToDashboard()">Enter the dashboard!</a><br><br><input type="button" value="logout" ng-click="$root.logout()"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('componentsAndViewsHTMLToJS');
} catch (e) {
  module = angular.module('componentsAndViewsHTMLToJS', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/public/angular-components/registration/registration.html',
    '<div class="component-registration" ng-controller="components.registration.controller">Hello, I am the registration controller :)<br>[[welcomeText]]</div>');
}]);
})();

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

(function(module) {
try {
  module = angular.module('componentsAndViewsHTMLToJS');
} catch (e) {
  module = angular.module('componentsAndViewsHTMLToJS', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/public/angular-views/dashboard/dashboard.html',
    '<div ng-controller="views.dashboard.controller"><h1>Bonjour! Tis the Dashboard something345567890 controller.</h1><p><i>I understand this uses the double [[. It\'s a quick and dirty sample :)</i></p><br>Welcome Text: [[welcomeText]]<br><hr><br><h2>Testing Registratiasdfon Component</h2><div ng-include="\'/public/angular-components/registration/registration.html\'"></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('componentsAndViewsHTMLToJS');
} catch (e) {
  module = angular.module('componentsAndViewsHTMLToJS', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/public/angular-views/index/index.html',
    '<div ng-controller="views.index.controller"><h1>Angular Component Testing</h1><p><i>I understand this uses the double [[. It\'s a quick and dirty sample :)</i></p><br>Welcome Text: [[welcomeText]]<br><br><h2>Testing Login Component</h2><div ng-include="\'/public/angular-components/login/login.html\'"></div><br><hr><br><h2>Testing Registration Component</h2><div ng-include="\'/public/angular-components/registration/registration.html\'"></div></div>');
}]);
})();

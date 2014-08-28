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

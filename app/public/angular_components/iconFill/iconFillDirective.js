(function(){

  angular
    .module("components_iconFill")
    .directive('iconFill', iconFillDirective);

  function iconFillDirective() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var object = angular.element(element[0].children[0]);
        if (angular.isDefined(attr.iconFill)) {
          object.load(object.attr("icon"), false, function () {
            object.find("svg").css("fill", attr.iconFill);
            if (angular.isDefined(attr.iconHeight)) {
              object.find("svg").css("height", attr.iconHeight);
            }
            if (angular.isDefined(attr.iconWidth)) {
              object.find("svg").css("width", attr.iconWidth);
            }
          });
        }
      }
    };
  }

})();
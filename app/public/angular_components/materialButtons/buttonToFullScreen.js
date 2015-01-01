(function(){

  angular
    .module("components_materialButtons")
    .directive('buttonToFullScreen', buttonToFullScreenDirective);

  function buttonToFullScreenDirective($timeout, $location) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        element.on("click", function(e) {

          var bg = attr.buttonToFullScreen;
          var newElement;
          var animateToSize = $(window).height() > $(window).width() ? $(window).height() : $(window).width();

          // Make a copy of the element so we can return the original later
          newElement = angular.element("<div></div>");

          element.css({
            opacity: 0
          });

          newElement.css({
            backgroundColor: bg,
            left: element.offset().left,
            top: element.offset().top,
            width: element.outerWidth(),
            height: element.outerHeight(),
            borderRadius: element.css("borderRadius")
          });

          newElement.addClass("buttonToFullScreen-fixed");
          newElement.find("*").remove();
          $("body").append(newElement);

          // Animate
          newElement.css({
            left: -$(window).width()/2,
            top: -$(window).height()/2,
            height: animateToSize*2,
            width: animateToSize*2
          });

          $timeout(function() {
            newElement.css({
              opacity: 0
            });
            element.css({
              opacity: 1
            });

            // Transition to link at the end?
            if (angular.isDefined(attr.transitionLink)) {
              $location.url(attr.transitionLink);
            }

            $timeout(function() {
              newElement.remove();
            }, 500);
          }, 500);

        });
      }
    };
  }

})();
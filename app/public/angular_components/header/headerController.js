(function() {

  angular
    .module("components_header")
    .controller("components_header_headerController", headerController);

  function headerController($scope, $location, components_header_headerService, $mdSidenav) {

    // ========================================
    // Interface
    // ========================================

    _.extend($scope, {
      headerService: components_header_headerService,
      openSidebar: openSidebar,
      gotoLink: gotoLink,
      goBack: goBack
    });

    _init();

    // ========================================
    // Routines
    // ========================================

    function _init() {

    }

    function goBack() {
      components_header_headerService.showBackButton = false;
      window.history.go(-1);
    }

    function gotoLink(link) {
      components_header_headerService.showBackButton = false;
      $location.url(link);
      $mdSidenav('left').toggle();
    }

    function openSidebar() {
      $mdSidenav('left').toggle();
    }

  }

})();

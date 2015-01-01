(function() {

  angular
    .module("views_profile")
    .controller("views_profile_profileController", profileController);

  function profileController($scope, components_header_headerService, components_profile_profileService, components_budget_budgetService) {

    // ========================================
    // Interface
    // ========================================

    _.extend($scope, {
      headerService: components_header_headerService,
      removeLocalData: removeLocalData
    });

    _init();

    // ========================================
    // Routines
    // ========================================

    function _init() {
      components_header_headerService.title = "Profile";
      components_header_headerService.headerBackground = "#F6872D";
      components_header_headerService.selectedLink = "profile";
    }

    function removeLocalData() {
      components_profile_profileService.model.reset();
      components_budget_budgetService.model.reset();
    }

  }

})();

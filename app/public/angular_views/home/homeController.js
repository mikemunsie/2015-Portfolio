(function() {

  angular
    .module("views_home")
    .controller("views_home_homeController", homeController);

  function homeController($scope, components_header_headerService, components_profile_profileService, components_budget_budgetService) {

    // ========================================
    // Interface
    // ========================================

    _.extend($scope, {
      loadSampleProfile: loadSampleProfile
    });

    _init();

    // ========================================
    // Routines
    // ========================================

    function _init() {
      components_header_headerService.title = "";
      components_header_headerService.headerBackground = "";
      components_header_headerService.selectedLink = "home";
    }

    function loadSampleProfile() {
      components_profile_profileService.model.read().name = "Sample User";
      components_budget_budgetService.model.read().salary = [
        { name: "My Salary", value: "2000.00"}
      ];
      components_budget_budgetService.model.read().bills = [
        { name: "Apartment", value: "550.00" },
        { name: "Phone", value:"90.00" },
        { name: "Food", value:"300.00" },
        { name: "Gas", value:"300.00" },
        { name: "Tolls", value:"50" }
      ];
    }
  }

})();

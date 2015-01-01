(function() {

  angular
    .module("views_budget")
    .controller("views_budget_budgetController", budgetController);

  function budgetController($scope, components_header_headerService, components_budget_budgetService) {

    var budgetService = components_budget_budgetService;

    // ========================================
    // Interface
    // ========================================

    _.extend($scope, {
      budgetService: budgetService,
      budgetPieData: budgetService.createBudgetPieData()
    });

    _init();

    // ========================================
    // Routines
    // ========================================

    function _init() {
      components_header_headerService.title = "Monthly Budget";
      components_header_headerService.headerBackground = "#4284F6";
      components_header_headerService.selectedLink = "budget";
    }

  }

})();

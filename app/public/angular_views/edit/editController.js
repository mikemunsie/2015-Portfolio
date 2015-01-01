(function() {

  angular
    .module("views_edit")
    .controller("views_edit_editController", editController);

  function editController($scope, components_header_headerService, components_budget_budgetService) {

    var budgetService = components_budget_budgetService;

    // ========================================
    // Interface
    // ========================================

    _.extend($scope, {
      budgetService: budgetService,
      addSalary: addSalary,
      addBill: addBill
    });

    _init();

    // ========================================
    // Routines
    // ========================================

    function _init() {
      components_header_headerService.title = "Edit Monthly Budget";
      components_header_headerService.headerBackground = "#4CCF4C";
      components_header_headerService.showBackButton = true;
    }

    function addSalary() {
      budgetService.budgetModel.salary.push({
        name: "",
        value: 0
      });
    }

    function addBill() {
      budgetService.budgetModel.bills.push({
        name: "",
        value: 0
      });
    }

  }

})();

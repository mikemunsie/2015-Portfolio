(function() {

  angular
    .module("components_budget")
    .factory("components_budget_budgetService", budgetService);

  function budgetService(components_dataModel_dataService) {

    var model = components_dataModel_dataService({
      name: "budgetModel",
      autoSaveEnabled: true,
      autoSaveInterval: 3000,
      model: {
        bills: [],
        salary: []
      }
    });

    var budgetModel = model.read();

    // ========================================
    // Interface
    // ========================================

    return {
      addBill: addBill,
      addSalary: addSalary,
      budgetModel: budgetModel,
      convertToMoney: convertToMoney,
      createBudgetPieData: createBudgetPieData,
      getSummary: getSummary,
      getTotalSalary: getTotalSalary,
      getTotalBills: getTotalBills,
      getTotalSavings: getTotalSavings,
      model: model,
      removeBill: removeBill,
      removeSalary: removeSalary,
      sanitizeMoney: sanitizeMoney
    };

    // ========================================
    // Routines
    // ========================================

    function addBill(bill) {
      if (isNaN(bill.value)) {
        salary.value = 0;
      }
      budgetModel.bills.push({
        name: bill.name,
        value: parseFloat(bill.value).toFixed(2)
      });
    }

    function addSalary(salary) {
      if (isNaN(salary.value)) {
        salary.value = 0;
      }
      budgetModel.salary.push({
        name: salary.name,
        value: parseFloat(salary.value).toFixed(2)
      });
    }

    function convertToMoney(val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function createBudgetPieData() {
      if (budgetModel.bills.length > 0 && budgetModel.salary.length > 0) {
        return {
          content: [
            {
              label: "Bills",
              value: parseInt(getTotalBills(), 0),
              color: "#F6872D"
            },
            {
              label: "Savings",
              value: parseInt(getTotalSavings(), 0),
              color: "#4CCF4C"
            }
          ]
        };
      } else {
        return {
          content: [
            {
              label: "No budget found.",
              value: 100,
              color: "#F6872D"
            }
          ]
        };
      }
    }

    function getSummary() {
      return {
        salary: getTotalSalary(),
        bills: getTotalBills(),
        savings: getTotalSavings()
      };
    }

    function getTotalSalary() {
      var total = 0;
      sanitizeMoney();
      _.forEach(budgetModel.salary, function(salaryItem) {
        total+=parseFloat(salaryItem.value);
      });
      console.log(total);
      total = parseFloat(total).toFixed(2);
      return total;
    }

    function getTotalBills() {
      var total = 0;
      sanitizeMoney();
      _.forEach(budgetModel.bills, function(billItem) {
        total+=parseFloat(billItem.value);
      });
      total = parseFloat(total).toFixed(2);
      return total;
    }

    function getTotalSavings() {
      var salaryTotal = getTotalSalary();
      var billsTotal = getTotalBills();
      return parseFloat(salaryTotal - billsTotal).toFixed(2);
    }

    function removeBill(billItem) {
      _.remove(budgetModel.bills, billItem);
    }

    function removeSalary(salaryItem) {
      _.remove(budgetModel.salary, salaryItem);
    }

    function sanitizeMoney() {
      _.forEach(budgetModel.bills, function(billItem) {
        if (isNaN(billItem.value)) {
          billItem.value = billItem.value.replace(/[^0-9\.]+/g,"");
          billItem.value = billItem.value === '' ? 0 : billItem.value;
        }
        billItem.value = parseFloat(billItem.value).toFixed(2);
      });
      _.forEach(budgetModel.salary, function(salaryItem) {
        if (isNaN(salaryItem.value)) {
          salaryItem.value = salaryItem.value.replace(/[^0-9\.]+/g,"");
          salaryItem.value = salaryItem.value === '' ? 0 : salaryItem.value;
        }
        salaryItem.value = parseFloat(salaryItem.value).toFixed(2);
      });
    }

  }

})();
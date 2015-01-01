/**
 * DataModel Component
 *
 * Creates a data persistent model that can be shared between
 * various controllers. The model is mapped through local storage
 * to help keep track of the data if the user refreshes a page.
 *
 */

(function(){

	var dependencies = [
	  "LocalStorageModule"
	];

	angular
		.module("components_dataModel", dependencies);

})();
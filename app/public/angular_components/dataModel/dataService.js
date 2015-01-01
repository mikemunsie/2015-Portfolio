(function(){

  angular
    .module("components_dataModel")
    .factory("components_dataModel_dataService", dataService);

  function dataService(localStorageService, $interval, $timeout){
    return function(newModel) {
      return new DataModel(newModel, localStorageService, $interval, $timeout);
    };
  }

  function DataModel(newModel, localStorageService, $interval, $timeout){
    var options = {
      autoSaveInterval: 6000,
      autoSaveEnabled: false,
      localStorage: true,
      model: {}
    };
    var autoSaveTimer = null;
    var models = DataModel.models;

    _init();

    // ========================================
    // Interface
    // ========================================

    return {
      _init: _init,
      autoSave: autoSave,
      create: create,
      loadModelFromLocalStorage: loadModelFromLocalStorage,
      read: read,
      remove: remove,
      reset: reset,
      save: save
    };

    // ========================================
    // Routines
    // ========================================

    function _init() {
      options = _.extend(options, newModel);
      if (localStorage) {
        loadModelFromLocalStorage();
      }
      if (!models[options.name]) {
        create();
      }
      if (options.autoSaveEnabled) {
        autoSave();
      }
    }

    function autoSave() {
      autoSaveTimer = $interval(function(){
        save();
      }, options.autoSaveInterval);
    }

    function create() {
      models[options.name] = {
        originalModel: options.model,
        model: angular.copy(options.model)
      };
      return this;
    }

    function loadModelFromLocalStorage() {
      if (localStorageService.get(options.name)) {
        models[options.name] = localStorageService.get(options.name);
      }
      return this;
    }

    function read() {
      return models[options.name].model;
    }

    function remove() {
      localStorageService.remove(options.name);
      $interval.cancel(autoSaveTimer);
      return this;
    }

    function reset() {
      angular.copy(models[options.name].originalModel, models[options.name].model);
      save();
      return models[options.name].model;
    }

    function save() {
      localStorageService.set(options.name, models[options.name]);
      return this;
    }

  }

  DataModel.models = {};

})();
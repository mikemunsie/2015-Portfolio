(function() {

  angular
    .module("components_profile")
    .factory("components_profile_profileService", profileService);

  function profileService(components_dataModel_dataService) {

    var model = components_dataModel_dataService({
      name: "profileModel",
      autoSaveEnabled: true,
      autoSaveInterval: 3000,
      model: {
        pic: "/public/images/avatar_1.png",
        background: "/public/images/profile_bg4.jpg",
        name: "New User"
      }
    });

    // ========================================
    // Interface
    // ========================================

    return {
      model: model
    };

  }

})();
(function() {

  angular
    .module("components_header")
    .factory("components_header_headerService", headerService);

  function headerService(components_profile_profileService) {

    // ========================================
    // Interface
    // ========================================

    return {
      title: "",
      selectedLink: "nothing",
      showBackButton: false,
      profile: components_profile_profileService.model.read()
    };
  }

})();
app.service('modalService', function($ionicModal, $rootScope) {

    var chatServicesModal = function(tpl, $scope) {
      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.chatServicesModal = modal;
        return modal;
      });

        $scope.closeModal = function() {
          $scope.chatServicesModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.chatServicesModal.remove();

        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {

          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {

          // Execute action
        });

      return promise;
    }

    var creditsModal = function(tpl, $scope) {
      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.creditsModal = modal;
        return modal;
      });

        $scope.closeModal = function() {
          $scope.creditsModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.creditsModal.remove();

        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {

          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {

          // Execute action
        });

      return promise;
    }

    var userModal = function(tpl, $scope) {
      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.userModal = modal;
        return modal;
      });

        $scope.closeModal = function() {
          $scope.userModal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.userModal.remove();

        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {

          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {

          // Execute action
        });

      return promise;
    }
    var chatModal = function(tpl, $scope) {
      var promise;
      $scope = $scope || $rootScope.$new();

      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.chatModal = modal;
        console.log("hhhh");
        return modal;
      });
      
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.chatModal.remove();

        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {

          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {

          // Execute action
        });

      return promise;
    }
    return {
      chatServicesModal: chatServicesModal,
      creditsModal: creditsModal,
      userModal: userModal,
      chatModal: chatModal

    }
})

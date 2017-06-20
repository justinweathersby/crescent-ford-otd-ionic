app.controller('DealershipCtrl', function($scope, $http, $state, $ionicLoading, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicPush,authService, currentUserService, userSvc, currentDealerService, currentDealerSvc, dealerService, DEALERSHIP_API, store) {

  $ionicLoading.show({
    template: '<p>Loading...</p><ion-spinner></ion-spinner>',
    hideOnStateChange: true,
    duration: 5000
  });

  $http({ method: 'GET',
          url: DEALERSHIP_API.url + "/dealerships"
        })
        .success( function( data )
        {
          $scope.dealerships = data;
          console.log($scope.dealerships, "dealerships");
          $ionicLoading.hide();
        }
      )
      .error( function(error)
      {
        $ionicLoading.hide();
      }
  );

  $scope.dealershipSelected = function(dealership_id){
    console.log("Dealership Selected::dealership_id::", dealership_id);
    if (dealership_id != null){
      dealerService.resetCurrent();
      $scope.currentUser = store.get('localUser');
      console.log($scope.currentUser);
      store.set('selected_dealership_id', dealership_id);


      //--This is for determining if this is a new user or old user changing thier viewing dealership
      if($scope.currentUser != null && $scope.currentUser.auth_token != null) // you had to have loged in if you have a token
      {
        $ionicHistory.clearCache();
        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner></ion-spinner>',
          hideOnStateChange: true,
          duration: 5000
        });

          //--Try to preload the dealership after click
          dealerService.getDealership().success(function(){
            $state.go('tab.dash');
            $ionicLoading.hide();

          }).error(function(){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Could Not Get Dealership Profile',
              template: "Please Restart Your App. If This problem continues please contact us."
            });
            $state.go('login');
          });


      }
      else{
        $state.go('signup');
      }
    }
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

});

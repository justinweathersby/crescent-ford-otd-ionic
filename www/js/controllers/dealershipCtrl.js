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
    //  currentUserService.dealership_id = dealership_id;

      //--This is for determining if this is a new user or old user changing thier viewing dealership
      if($scope.currentUser != null && $scope.currentUser.auth_token != null) // you had to have loged in if you have a token
      {
        $ionicHistory.clearCache();
        $ionicLoading.show({
          template: '<p>Loading...</p><ion-spinner></ion-spinner>',
          hideOnStateChange: true,
          duration: 5000
        });



        // localforage.setItem('currentUser', currentUserService).then(function (value){
        //   console.log("Value set in currentDealer:", JSON.stringify(value));

          //--Try to preload the dealership after click
          dealerService.getDealership().success(function(){
            // console.log("About to go to tab.dash... currentUser.dealership_id: ", JSON.stringify(currentUserService));
            $state.go('tab.dash');
            $ionicLoading.hide();

          }).error(function(){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Could Not Get Dealership Profile',
              template: "Please Restart Your App. If This problem continues please contact us."
            });
            //$state.go('login');
            $state.go('sign-in-up', {'isSignUp': false});
          });


        // }).catch(function(err){
        //   console.log("SET ITEM ERROR::singupCtrl::dealershipSelected::currentUser::", JSON.stringify(err));
        // });

      }
      else{
        store.set('selected_dealership_id', dealership_id);
        //$state.go('signup');
        $state.go('sign-in-up', {isSignUp: true});
      }
    }
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

});

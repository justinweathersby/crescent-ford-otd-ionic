// NOTE: This is the old SignUp Controller, we are using the SignInUpCtrl instead.

app.controller('SignupCtrl', function($scope, $state, $http, $stateParams,
                                      $ionicPlatform, $ionicPush, $ionicPopup, $ionicLoading, $ionicHistory,
                                      authService, currentUserService, currentDealerService, dealerService,
                                      DEALERSHIP_API, userSvc, currentDealerSvc, store)
{
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
            $state.go('login');
          });
      }
      else{
        store.set('selected_dealership_id', dealership_id);
        $state.go('signup');
      }
    }
  }

  $scope.createUser = function(user){

    console.log("Inside createUser - user: " + JSON.stringify(user));
    $scope.currentUser = store.get('localUser');
    if ($scope.signupForm.$valid){
      console.log("valid?");

      $ionicPlatform.ready(function() {
        console.log("ionic platform is ready");
        $ionicPush.register().then(function(t) {
console.log("in then for ionic push register: " + t);
}, function(error) {
console.log("error in ionic push register: " + error);
}).catch(function(e) {
  console.log("Error in ionicPush.register() : " + e);
});
});
        // $ionicPush.register().then(function(t) {
        //   console.log("ionic push register then statement");
        //   return $ionicPush.saveToken(t);
        // }).then(function(t) {
        //   console.log('After ionic register');
        //   currentUserService.device_token = t.token;
        //   currentUserService.device_type = t.type;
        //
        //   console.log("DEVICE TOKEN:::::::", t.token);
        //
        //   $ionicLoading.show({
        //     template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        //   });
        //
        //   $http.post(DEALERSHIP_API.url + "/users", {user: {email: user.email,
        //                                                      password: user.password,
        //                                                      name: user.name,
        //                                                      device_token: t.device_token,
        //                                                      device_type: t.device_type,
        //                                                      dealership_id: store.get('selected_dealership_id')}})
        //   .success( function (data) {
        //     console.log("SignUpResponse: " + JSON.stringify(data));
        //     $ionicLoading.hide();
        //     $state.go('tab.dash');
        //   })
        //   .error( function(error)
        //   {
        //     console.log("Signup Error");
        //     $ionicLoading.hide();
        //     var errorResponse = "";
        //     if (angular.isDefined(error.errors)){
        //       if ( angular.isDefined(error.errors.password)){
        //         errorResponse = "Password: " + error.errors.password;
        //       }
        //       if (angular.isDefined(error.errors.email)){
        //         errorResponse += "<br>Email: " + error.errors.email;
        //       }
        //     }
        //     else{
        //       errorResponse += "<br>Error: " + error;
        //     }
        //     var alertPopup = $ionicPopup.alert({
        //       title: 'Well, We Have A Problem...',
        //       template: errorResponse
        //     });
        //   });
        // }).catch(function(e) {
        //   console.log("Error in ionicPush.register() : " + e);
        // });
      // });
    }
    else{
      console.log("error");
      var errorResponse = "";
      if(user.password != user.password_confirmation){
        errorResponse = "Passwords do not match";
      }
      else{
        errorResponse = "Fields cannot be blank or of incorrect format";
      }
      var alertPopup = $ionicPopup.alert({
        title: 'Incorrect Input',
        template: errorResponse
      });
    }

  };

  $scope.goToLogin = function() {
    $state.go('login');
  };

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };

  $scope.termsAndConditions = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Terms & Conditions',
      template: '<div style="text-align: center">None uploaded yet</div>'
    });
  };

});

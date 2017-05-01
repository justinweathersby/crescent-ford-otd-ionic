app.controller('LoginCtrl', function($scope, $http, $state, $ionicLoading, $ionicPopup,       $ionicPlatform, $ionicPush,authService, currentUserService, userSvc, currentDealerService, currentDealerSvc, dealerService, DEALERSHIP_API, store) {


  $ionicPlatform.ready(function() {
    $scope.currentUser = userSvc.getUser();
    $scope.dealership = currentDealerSvc.getDealership();

  if($scope.dealership.id === undefined){
    console.log("no current dealership");
    //-- Get Current User Object

    $scope.currentUser = store.get('localUser');
    console.log($scope.currentUser);
    $scope.dealership = store.get('localDealership')
    console.log($scope.dealership);

  }
});

  $scope.login = function(user) {
    $ionicLoading.show({
       template: '<p style="font-family:Brandon;color:grey;">Logging in</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
       hideOnStateChange: true,
       duration: 8000
    });

    if ($scope.loginForm.$valid){
        console.log("loginCtrl::currentUserService:::", JSON.stringify(currentUserService));

        authService.login(user).success(function(data){
          /// this sets and gets the currentUser///
          userSvc.setUser(data);
          $scope.currentUser = userSvc.getUser();
          console.log($scope.currentUser);
          //--Try to preload the dealership after click
          dealerService.getDealership().success(function(data){
            console.log(data);
            //this sets and gets current dealership
            currentDealerSvc.setDealership(data)
            $scope.currentDealership = currentDealerSvc.getDealership();
            console.log($scope.currentDealership);
            $state.go('tab.dash');
            $ionicLoading.hide();

        }).error(function(err){
          console.log(err);
           $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: 'Could Not Get Dealership Profile',
              template: "Please Restart Your App. If This problem continues please contact us."
            });
            $state.go('login');
          });
        }).error(function(){
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Login Unsuccessful',
            template: "Email and password did not match our records."
          });
        });
    }
    else{
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login Unsuccessful',
        template: "Email must be in correct format and password cannot be empty"
      });
    }
  }; //end of login function


  $scope.resetPassword = function(email) {
    $ionicLoading.show({
       template: '<p style="font-family:Brandon;color:grey;">Checking to see if your account exists..</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
       hideOnStateChange: true,
       duration: 5000
    });

    $http({method: 'POST', url: DEALERSHIP_API.url + '/reset_password?email=' + email})
      .success( function( data )
      {
        $ionicLoading.hide();
        $ionicPopup.alert({
           title: 'Thank You',
           content: 'An email has been sent to the email provided with instructions to reset your password.'
         });
         $state.go('login');
      }
    )
    .error( function(error)
    {
      $ionicLoading.hide();
      $ionicPopup.alert({
         title: 'Woops..',
         content: 'The email you have entered does not exist in our records'
       });
       $state.go('signup');
    });
  };//end of reset password function

  $scope.goToSignUp = function() {
    $ionicLoading.show({
       template: '<p style="font-family:Brandon;color:grey;">Loading..</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
       hideOnStateChange: true,
       duration: 5000
    });

    $http({ method: 'GET',
            url: DEALERSHIP_API.url + "/dealerships"
          })
          .success( function( data )
          {
            $scope.dealerships = data;

            $ionicLoading.hide();

            if ($scope.dealerships.length > 1){
              $state.go('dealership-list');
            }
            else{
              dealerService.resetCurrent();
              currentUserService.dealership_id = $scope.dealerships[0].id

              localforage.setItem('currentUser', currentUserService).then(function (value){
                console.log("Value set in currentDealer:", JSON.stringify(value));

                //--Try to preload the dealership after click
                dealerService.getDealership().success(function(){
                  $state.go('signup');

                }).error(function(){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Could Not Get Dealership Profile',
                    template: "Please Restart Your App. If This problem continues please contact us."
                  });
                  $state.go('login');
                });
              }).catch(function(err){
                console.log("SET ITEM ERROR::loginCtrl::goToSignup::currentUser::", JSON.stringify(err));
              });
            }
          }
        )
        .error( function(error)
        {
          $ionicLoading.hide();
        }
    );
  };

  $scope.goToLogin = function() {
    $state.go('login');
  };

  $scope.goToForgotPassword = function() {
    $state.go('forgot-password');
  };

});

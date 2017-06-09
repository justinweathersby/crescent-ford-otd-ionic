app.controller('SignInUpCtrl', function($scope, $state, $http, $stateParams,
                                      $ionicPlatform, $ionicPush, $ionicPopup, $ionicPopup, $ionicLoading, $ionicHistory,
                                      authService, currentUserService, currentDealerService, dealerService,
                                      DEALERSHIP_API, userSvc, currentDealerSvc, store) {


  $scope.switchSignInUp = function(isSignUp) {
    if ($scope.isSignUp) { // Sign Up
      if (!isSignUp)
        $scope.goToSignIn();

    } else { // Sign In
      if (isSignUp)
        $scope.goToSignUp();
    }

  }


  $scope.isSignUp = ($stateParams.isSignUp == undefined || $stateParams.isSignUp == null ) ? false : $stateParams.isSignUp;
  console.log('isSignUp', $scope.isSignUp );
  $scope.switchSignInUp($scope.isSignUp);


  /////////// Log In Tab /////////

  //-- Get Current User Object
  $scope.goToSignIn = function() {
    $scope.isSignUp = false;

    localforage.getItem('currentUser').then(function(value){
      angular.copy(value, currentUserService);

      //-- Load Current Dealer
      localforage.getItem('currentDealer').then(function (value){
        angular.copy(value, currentDealerService);
        if(currentUserService.token){
          $state.go('tab.dash');
        }
        else{
          console.log("Getting Device Token in Login Ctrl");
          $ionicPlatform.ready(function() {
            $scope.currentUser = userSvc.getUser();
            $scope.dealership = currentDealerSvc.getDealership();

          if($scope.dealership.id === undefined){
            console.log("no current dealership");
            //-- Get Current User Object

            $scope.currentUser = store.get('localUser');
            console.log($scope.currentUser);
            // if($scope.currentUser === null) {
            //   $state.go('signup');
            // }
            $scope.dealership = store.get('localDealership')
            console.log($scope.dealership);
          }
            $ionicPush.register().then(function(t) {
              return $ionicPush.saveToken(t);
            }).then(function(t) {
              currentUserService.device_token = t.token;
              currentUserService.device_type = t.type;

              console.log("loginCTRL::::DEVICE TOKEN:::::::", t.token);

              localforage.setItem('currentUser', currentUserService).then(function (value){
                console.log("Value set in loginctrl:", JSON.stringify(value));

              }).catch(function(err){
                console.log("SET ITEM ERROR::app.js::currentUserService::", JSON.stringify(err));
              });
            });
          }); //end platform ready
        }
      }).catch(function(err){
        console.log("GET ITEM ERROR::loginCtrl::currentDealer::", JSON.stringify(err));
      });
    }).catch(function(err) {console.log("GET ITEM ERROR::LoginCtrl::currentUser", JSON.stringify(err));});

  }


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
          store.set('localUser', $scope.currentUser);
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
            //$state.go('login');
            $scope.goToSignIn();
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

  $scope.goToSignUp = function() {
    $ionicLoading.show({
       template: '<p style="font-family:Brandon;color:grey;">Loading..</p><ion-spinner class="spinner-positive" icon="dots"></ion-spinner>',
       hideOnStateChange: true,
       duration: 5000
    });

    dealerService.getDealerships().success(function(data){
            $scope.dealerships = data;
            console.log($scope.dealerships, "dealerships");

            $ionicLoading.hide();

            if ($scope.dealerships.length >= 1){
              $state.go('dealership-list');
            } else {
              dealerService.getDealership().success(function(data){
                console.log(data);
                //this sets and gets current dealership
                currentDealerSvc.setDealership(data)
                $scope.currentDealership = currentDealerSvc.getDealership();
                console.log($scope.currentDealership);
                //$state.go('signup');
                $scope.isSignUp = true;
                $scope.loadForSignUp();
                $ionicLoading.hide();

            }).error(function(err){
              console.log(err);
               $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Could Not Get Dealership Profile',
                  template: "Please Restart Your App. If This problem continues please contact us."
                });
                //$state.go('login');
                $scope.goToSignIn();
              });

          }
    }).error(function(){
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login Unsuccessful',
        template: "Email and password did not match our records."
      });
    });
  }

  $scope.goToForgotPassword = function() {
    $state.go('forgot-password');
  };

  ////////////////////////////////


  /////////// Sign Up ////////////
  $scope.loadForSignUp = function() {
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
  }

  $scope.createUser = function(user){

    console.log(user);
    $scope.currentUser = store.get('localUser');
    if ($scope.signupForm.$valid){
      console.log("valid?");

      $ionicPlatform.ready(function() {
        $ionicPush.register().then(function(t) {
          return $ionicPush.saveToken(t);
        }).then(function(t) {
          currentUserService.device_token = t.token;
          currentUserService.device_type = t.type;

          console.log("DEVICE TOKEN:::::::", t.token);

          $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
          });

          $http.post(DEALERSHIP_API.url + "/users", {user: {email: user.email,
                                                             password: user.password,
                                                             name: user.name,
                                                             device_token: t.device_token,
                                                             device_type: t.device_type,
                                                             dealership_id: store.get('selected_dealership_id')}})
          .success( function (data) {
            console.log("SignUpResponse: " + JSON.stringify(data));
            $ionicLoading.hide();
            $state.go('login');
            // $scope.currentUser.token = data.user.auth_token;
            // $scope.currentUser.id = data.user.id;
            // $scope.currentUser.name = data.user.name;
            // $scope.currentUser.email = data.user.email;
            // $scope.currentUser.roles = data.roles;
            // $scope.currentUser.isCustomer = data.isCustomer;

            // userSvc.setUser(data.user);

          })
          .error( function(error)
          {
            $ionicLoading.hide();
            var errorResponse = "";
            if (angular.isDefined(error.errors)){
              if ( angular.isDefined(error.errors.password)){
                errorResponse = "Password: " + error.errors.password;
              }
              if (angular.isDefined(error.errors.email)){
                errorResponse += "<br>Email: " + error.errors.email;
              }
            }
            else{
              errorResponse += "<br>Error: " + error;
            }
            var alertPopup = $ionicPopup.alert({
              title: 'Well, We Have A Problem...',
              template: errorResponse
            });
          });
        });
      });
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

  $scope.termsAndConditions = function() {

  }

  ///////////////////////////////
});

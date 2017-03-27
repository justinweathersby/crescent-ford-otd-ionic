//-- This service contains user information for authorization and authentication needs
app.service('currentUserService', function(){
  this.id =
  this.token =
  this.name =
  this.email =
  this.dealership_id =
  this.device_token =
  this.isCustomer =
  this.device_type = null;

  this.roles = [];
  // check logs for blank
});

app.service('currentDealerService', function(){
  this.id =
  this.name =
  this.phone =
  this.location =
  this.primary_color =
  this.new_cars_url =
  this.used_cars_url =
  this.service_url =
  this.specials_url =
  this.service_specials_url =
  this.parts_url =
  this.financing_url =
  this.service_email =
  this.sales_email =
  this.facebook_url =
  this.twitter_url =
  this.logo_url =
  this.background_image_url =
  this.iframeFriendly = null;

  this.sales_reps = [];
  this.service_reps = [];
});

app.service('dealerService', function($http, $ionicLoading, currentUserService, currentDealerService, DEALERSHIP_API){
  this.resetCurrent = function (){
    currentDealerService.id =
    currentDealerService.name =
    currentDealerService.location =
    currentDealerService.primary_color =
    currentDealerService.new_cars_url =
    currentDealerService.used_cars_url =
    currentDealerService.specials_url =
    currentDealerService.service_url =
    currentDealerService.service_specials_url =
    currentDealerService.parts_url =
    currentDealerService.financing_url =
    currentDealerService.service_email =
    currentDealerService.sales_email =
    currentDealerService.facebook_url =
    currentDealerService.twitter_url =
    currentDealerService.logo_url =
    currentDealerService.background_image_url =
    currentDealerService.iframeFriendly = null;
  };

  this.getSalesReps = function(){
    console.log("CHECK::Services::getSalesReps::currentUser::", JSON.stringify(currentUserService));
    return $http({ method: 'GET',
                      url: DEALERSHIP_API.url + "/dealerships/" + currentUserService.dealership_id + "/sales_reps",
                      headers: {'Authorization' : currentUserService.token}
                }).success( function(data){
                  console.log("INFO::services::getSalesReps::data::" + JSON.stringify(data));
                  currentDealerService.sales_reps = [];
                  var newData = angular.copy(data);
                  currentDealerService.sales_reps.push(newData);

                  localforage.setItem('currentDealer', currentDealerService).then(function (value){
                    // console.log("Value set in currentDealer:", JSON.stringify(value));'
                    console.log("SUCCESS GET SALES REPS:: " + JSON.stringify(currentDealerService.sales_reps));
                  }).catch(function(err){
                    console.log("SET ITEM ERROR::Services::authService::currentUser::", JSON.stringify(err));
                  });

                }).error( function(error){
                  console.log("ERROR GET SALES REPS:: " + JSON.stringify(error));
                });
  };

  this.getServiceReps = function(){
    console.log("CHECK::Services::getServiceReps::currentUser::", JSON.stringify(currentUserService));
    return $http({ method: 'GET',
                      url: DEALERSHIP_API.url + "/dealerships/" + currentUserService.dealership_id + "/service_reps",
                      headers: {'Authorization' : currentUserService.token}
                }).success( function(data){
                    currentDealerService.service_reps = [];
                    var newData = angular.copy(data);
                    currentDealerService.service_reps.push(newData);

                    console.log("1_) returned service reps: " + JSON.stringify(data));
                    console.log("2_) currentDealerService.service_reps: " + JSON.stringify(currentDealerService.service_reps));

                    localforage.setItem('currentDealer', currentDealerService).then(function (value){
                      // console.log("Value set in currentDealer:", JSON.stringify(value));
                      console.log("SUCCESS GET SERVICE REPS:: " + JSON.stringify(currentDealerService.service_reps));
                    }).catch(function(err){
                      console.log("SET ITEM ERROR::Services::authService::currentUser::", JSON.stringify(err));
                    });

                }).error( function(error){
                  console.log("ERROR GET SERVICE REPS:: " + JSON.stringify(error));
                });
  };

  this.getDealership = function(){
    //-- Get Current User Object
    // localforage.getItem('currentUser').then(function(value){
    //   currentUserService = value;
      console.log("SUCCESS::getDealership::currentUserService::" + JSON.stringify(currentUserService));
    // }).catch(function(err) {console.log("GET ITEM ERROR::LoginCtrl::currentUser", JSON.stringify(err));});

    return $http({ method: 'GET',
        url: DEALERSHIP_API.url + "/dealerships/" + currentUserService.dealership_id
    }).success( function( data ){
        currentDealerService.id = data.id;
        currentDealerService.name = data.name;
        currentDealerService.phone = data.phone;
        currentDealerService.location = "maps:?q=" + data.location.street + ' ' + data.location.city + ', ' + data.location.state + ' ' + data.location.zipcode;
        currentDealerService.primary_color = data.primary_color;
        currentDealerService.new_cars_url = data.new_cars_url;
        currentDealerService.used_cars_url = data.used_cars_url;
        currentDealerService.service_url = data.service_url;
        currentDealerService.service_specials_url = data.service_specials_url;
        currentDealerService.specials_url = data.specials_url;
        currentDealerService.parts_url = data.parts_url;
        currentDealerService.financing_url = data.financing_url;
        currentDealerService.service_email = data.service_email;
        currentDealerService.sales_email = data.sales_email;
        currentDealerService.facebook_url = data.facebook_url;
        currentDealerService.twitter_url = data.twitter_url;
        currentDealerService.logo_url = data.logo_url;
        currentDealerService.background_image_url = data.background_image_url;
        currentDealerService.iframeFriendly = data.iframeFriendly;

        localforage.setItem('currentDealer', currentDealerService).then(function (value){
          // console.log("Value set in currentDealer:", JSON.stringify(value));
          console.log("INFO::services::getDealership::currentDealerService::", JSON.stringify(currentDealerService));
        }).catch(function(err){
          console.log("SET ITEM ERROR::Services::authService::currentUser::", JSON.stringify(err));
        });

        $ionicLoading.hide();
      }).error( function(error){
          console.log("ERROR::services::getDealership::GET::deaelerships::", JSON.stringify(error));
          console.log("ERROR::MORE INFO::currentUserService:", JSON.stringify(currentUserService));
          $ionicLoading.hide();
      });
  };


});


//-- This service handles all authentication between app and Chatter API
app.service('authService', function($http, $ionicPlatform, $ionicPush, currentUserService, DEALERSHIP_API){
  this.login = function(user){

    $ionicPlatform.ready(function() {
      $ionicPush.register().then(function(t) {
        return $ionicPush.saveToken(t);
      }).then(function(t) {
        currentUserService.device_token = t.token;
        currentUserService.device_type = t.type;
      });
    });

    return  $http({method: 'POST',
                   url: DEALERSHIP_API.url + '/login',
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password, 'X-API-DEVICE-TOKEN' : currentUserService.device_token, 'X-API-DEVICE-TYPE' : currentUserService.device_type}})
      .success( function( data )
      {
        currentUserService.token = data.auth_token;
        currentUserService.id = data.id;
        currentUserService.name = data.name;
        currentUserService.email = data.email;
        currentUserService.dealership_id = data.dealership_id;
        currentUserService.roles = data.roles;
        currentUserService.isCustomer = data.isCustomer;

        localforage.setItem('currentUser', currentUserService).then(function (value){
          // console.log("Value from getting currentUserService:", JSON.stringify(value));
        }).catch(function(err){
          console.log("SET ITEM ERROR::Services::authService::currentUser::", JSON.stringify(err));
        });

        $http.defaults.headers.common['Authorization'] = data.auth_token;
      }
    )
    .error( function(error)
    {
      console.log("ERROR::services::authService::POST::login::", JSON.stringify(error));
    });
  }; //--End of login function

  this.resetCurrent = function(){
    currentUserService.id =
    currentUserService.token =
    currentUserService.name =
    currentUserService.email =
    currentUserService.dealership_id = null;
  };
});


app.service('currentConversation', function(){
  this.id =
  this.sender_id =
  this.sender_name =
  this.sender_image =
  this.last_message = null;
});

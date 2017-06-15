
//-- This service handles all authentication between app and Chatter API
app.service('authService', function($http, $ionicPlatform, $ionicPush, currentUserService, DEALERSHIP_API){
  this.login = function(user){
     console.log("authService.login::CURRENT USER DEVICE TOKEN:::", currentUserService.device_token);
    console.log("authService.login::CURRENT USER DEVICE TOKEN:::", currentUserService.device_type);

    return  $http({method: 'POST',
                   url: DEALERSHIP_API.url + '/login',
                   headers: {'X-API-EMAIL' : user.email, 'X-API-PASS' : user.password, 'X-API-DEVICE-TOKEN' : currentUserService.device_token, 'X-API-DEVICE-TYPE' : currentUserService.device_type}})
      .success( function( data )
      {
        console.log("data from auth service", data.auth_token, data.id, data.name, data.email);
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
  this.id = '';
  this.sender_id = '';
  this.sender_name = '';
  this.sender_image = '';
  this.last_message = null;
});

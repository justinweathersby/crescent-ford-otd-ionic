//-- This service contains user information for authorization and authentication needs
app.factory('userSvc', function(store) {
    var user = {};


    function getUser() {
      return user;
    }

    function getUserToken() {
      return user.auth_token;
    }

    function setUser(currentUser) {
      store.set('localUser', currentUser);
      user = currentUser;
    }


    return {

      getUser: getUser,
      getUserToken: getUserToken,
      setUser: setUser

    };

  })

app.service('currentUserService', function(){

  this.id;
  this.token;
  this.name;
  this.email;
  this.dealership_id;
  this.device_token;
  this.isCustomer;
  this.device_type;

  this.roles = [];
  // check logs for blank

})

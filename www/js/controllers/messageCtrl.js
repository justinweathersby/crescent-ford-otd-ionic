app.controller('MessageCtrl', function($rootScope, $scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, $cordovaBadge,
                                        currentUserService, currentConversation,
                                        DEALERSHIP_API)
{

  $scope.$on('cloud:push:notification', function(event, data) {
    var payload = data.message.raw.additionalData.payload;
    console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
    if (payload.user_message == 1){
      if (payload.conversation_id == currentConversation.id){
        $scope.getMessages();
        $rootScope.$apply(function () {
          $rootScope.message_badge_count=0;
        });
      }
    }
  });

  window.addEventListener('native.keyboardshow', keyboardShowHandler);
  window.addEventListener('native.keyboardhide', keyboardHideHandler);

  function keyboardShowHandler(e){
      console.log('Keyboard height is: ' + e.keyboardHeight);
      $ionicScrollDelegate.scrollBottom(true);
  }
  function keyboardHideHandler(e){
      console.log('Goodnight, sweet prince');
      $ionicScrollDelegate.scrollBottom(true);
  }

  $rootScope.message_badge_count = 0;
  $scope.current_user = currentUserService;

  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');


  $scope.getMessages = function() {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 5000
    });
    localforage.getItem('currentUser').then(function(value){
      angular.copy(value, currentUserService);

      localforage.getItem('conversation').then(function(value) {
        $scope.current_conv = value;
        $http({ method: 'GET',
                  url: DEALERSHIP_API.url + "/messages",
                  params: { "conversation_id": $scope.current_conv.id },
                  headers: {'Authorization' : currentUserService.token}
              }).success( function( data ){
                  console.log("GOT MESSAGES SUCCESS::::");
                  console.log( JSON.stringify(data, null, 4));
                  $scope.messages = data.messages;
              }).error( function(error){
                  console.log( JSON.stringify(error, null, 4));
                  if (error.errors === "Not authenticated"){
                    $cordovaDialogs.alert(
                      "Sorry you have been logged out. Please re-login",
                      "Woops",  // a title
                      "OK"                                // the button text
                    );
                    $state.go('login');
                  }
                  $state.go('tab.conversations');
            }).finally(function() {
                 $ionicLoading.hide();
                 $scope.$broadcast('scroll.refreshComplete');
                 $timeout(function() {
                    viewScroll.resize(true);
                    viewScroll.scrollBottom(true);
                  }, 1000);
            });
        }).catch(function(err) { console.log("GET ITEM ERROR::Messages::getMessages::conversation", JSON.stringify(err));});
    }).catch(function(err) { console.log("GET ITEM ERROR::Messages::getMessages::user_token", JSON.stringify(err));});
  };

  $scope.getMessages();

  $scope.reply = function(body){
    $ionicLoading.show({
        template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 5000
    });
    localforage.getItem('currentUser').then(function(value){
      angular.copy(value, currentUserService)
      localforage.getItem('conversation').then(function(value) {
        $scope.current_conv = value;
        $http({ method: 'POST',
                  url: DEALERSHIP_API.url + "/messages",
                  data: {
                    "message":{
                    "body": body
                    },
                    "recipient_id": $scope.current_conv.sender_id
                  },
                  headers: {'Authorization' : currentUserService.token}
        }).success( function( data ){
                $ionicLoading.hide();
                delete $scope.replyMessage.body;
                $scope.getMessages();
        }).error( function(error){
                $ionicLoading.hide();
                console.log(error);
        });
      }).catch(function(err) { console.log("GET ITEM ERROR::Messages::getMessages::", JSON.stringify(err));});
    }).catch(function(err) { console.log("GET ITEM ERROR::Messages::getMessages::", JSON.stringify(err));});
  };

  $scope.afterMessagesLoad = function(){
    $timeout(function() {
       viewScroll.resize(true);
       viewScroll.scrollBottom(true);
     }, 1000);
  }

});

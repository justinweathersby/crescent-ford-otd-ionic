app.controller('MessageCtrl', function($rootScope, $scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, $cordovaBadge,
                                        currentUserService, currentConversation,SocketService,store,
                                        DEALERSHIP_API)
{

  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
  $scope.current_user = currentUserService;

  function keyboardShowHandler(e){
      console.log('Keyboard height is: ' + e.keyboardHeight);
      $ionicScrollDelegate.scrollBottom(true);
  }
  function keyboardHideHandler(e){
      console.log('Goodnight, sweet prince');
      $ionicScrollDelegate.scrollBottom(true);
  }

  $scope.$on('$ionicView.enter', function() {
	if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.disableScroll(true);
	}
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

  });


  $scope.$on('$ionicView.leave', function() {
	  if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.disableScroll(false);
	  }
    window.removeEventListener('native.keyboardshow', keyboardShowHandler);
    window.removeEventListener('native.keyboardhide', keyboardHideHandler);    
  });

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
                      "OK"    // the button text
                    );
                    $state.go('login');
                  }
					var unique_id = store.get("unique_id");
					var room = {
						'room_name': unique_id
					};
					SocketService.emit('leave:room', room);
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

  SocketService.on('message', function(msg){
		console.log(msg);
		$scope.messages.push(msg);
		$ionicScrollDelegate.scrollBottom();
  });

  $scope.reply = function(body){
    $ionicLoading.show({
        template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 2000
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
				console.log(data);
				console.log(store);
				var room = store.get('unique_id');
				console.log(room);
				var recipient_id = store.get('recipient_id');
				console.log(recipient_id);
				var conversation_id = store.get('conversation_id');
				console.log(conversation_id);
				var msg = {
					'room': room,
					'user': value.sender_name,
					'text': body,
					'recipient_id': recipient_id,
					'conversation_id': conversation_id
				}
				console.log(msg);
				SocketService.emit('send:message', msg);
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

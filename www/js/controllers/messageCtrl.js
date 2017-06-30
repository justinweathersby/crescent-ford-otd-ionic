app.controller('MessageCtrl', function($rootScope, $scope, $state, $http, $stateParams, $timeout,
                                        $ionicPopup, $ionicLoading, $ionicScrollDelegate, $cordovaDialogs, $cordovaBadge,
                                        currentUserService, currentConversation,SocketService,store,
                                        DEALERSHIP_API)
{

  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
  $scope.current_user = store.get('localUser');
  $rootScope.message_badge_count = 0;
  
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
    console.log("inside messagesCtrl::getMessages()");
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 5000
    });

    localforage.getItem('conversation').then(function(value) {
      $scope.current_conv = value;
      $http({ method: 'GET',
                url: DEALERSHIP_API.url + "/messages",
                params: { "conversation_id": $scope.current_conv.id },
                headers: {'Authorization' : $scope.current_user.auth_token}
            }).success( function( data ){
                console.log("GOT MESSAGES SUCCESS::::");
                console.log( JSON.stringify(data, null, 4));
                $scope.messages = data.messages;
				$ionicScrollDelegate.scrollBottom();				
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
  };

  $scope.getMessages();
  
  SocketService.removeListener('message');
  SocketService.on('message', function(msg){	  
	  console.log($scope.current_user.id+'###'+msg.recipient_id);
	  if($scope.current_user.id == msg.recipient_id){	
		if (msg.conversation_id == store.get('conversation_id')){		  
			console.log(SocketService);
			console.log($scope.current_user);		
			console.log(msg);		
			if($state.current.name =='tab.messages'){
				$scope.messages.push(msg);
				$ionicScrollDelegate.scrollBottom();
			}
		}else{
			$rootScope.message_badge_count = $rootScope.message_badge_count + 1;
		}
	  }
  });

  $scope.reply = function(body){	  
    $ionicLoading.show({
        template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 2000
    });

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
                headers: {'Authorization' : $scope.current_user.auth_token}
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
  };
  
  function callback(){
	  console.log('listener added');
  }
  $scope.afterMessagesLoad = function(){
    $timeout(function() {
       viewScroll.resize(true);
       viewScroll.scrollBottom(true);
     }, 1000);
  }

});

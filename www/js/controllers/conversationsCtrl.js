app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,$ionicPopup, $ionicLoading, $ionicModal,currentUserService, currentConversation, currentDealerService, dealerService, SocketService, $ionicPlatform, userSvc, currentDealerSvc, store, modalService, $ionicScrollDelegate, DEALERSHIP_API, ChatService, $ionicHistory){

  // var me = this;
    $scope.text = "";
		$scope.messages = [];
    $scope.serviceRep = {};
    $scope.room = {
     'room_name': "services" /// TODO change? necessary?
 };

  $ionicPlatform.ready(function() {
    $scope.currentUser = userSvc.getUser();
    console.log($scope.currentUser);
    $scope.dealership = currentDealerSvc.getDealership();
    console.log($scope.dealership);

  if($scope.dealership.id === undefined){
    console.log("no current dealership");
    //-- Get Current User Object

    $scope.currentUser = store.get('localUser');
    console.log($scope.currentUser);
    $scope.dealership = store.get('localDealership')
    console.log($scope.dealership);


  //  SocketService.emit('join:room', $scope.room);
  }

  ChatService.getMessages().then(function(result) {
      console.log(result, "messages");
      $scope.conversations = result.data.data.conversations;

    }).catch(function(err) {
      console.log(err, "error");

  })

}); //end of platform ready

  $scope.goBack = function() {
    console.log("h");
    SocketService.emit('leave:room', $scope.room);
     $state.go('tab.conversations');
  }


  $scope.startServicesChat = function(x) {
    console.log(x);
    store.set('recipient_id', x.id);
    SocketService.emit('join:room', $scope.room);
    ///write a service to hold service rep info
    $scope.chatServicesModal.hide();
  //   $state.go('chat',{room:x.created_at})
   $state.go('chat',{room:x.created_at}) //CHANGE TO WHAT? TODO?
}

  $scope.isNotCurrentUser = function(user){

  			if($scope.currentUser.name != user){
  				return 'not-current-user';
  			}
  			return 'current-user';
		};

    $scope.openServiceModal = function() {
      modalService
        .chatServicesModal('templates/modals/chatServices_modal.html', $scope)
        .then(function(modal) {
          modal.show();
          dealerService.getSalesReps().then(function(result){
            console.log(result, "result");
            $scope.reps = result.data;
          }).catch(function(err){
            console.log(err, "error");
          })
        });

    }

  $scope.sendTextMessage = function(text) {
    console.log($scope.room);
    var recipient_id = store.get('recipient_id');
    var conversation_id = store.get('conversation_id')
  			var msg = {
  				'room': $scope.room.room_name,
  				'user': $scope.currentUser.name,
  				'text': text,
          'recipient_id': recipient_id,
          'conversation_id': conversation_id
  				//'time': moment() // do you want time?
  			};

      ChatService.saveMessage(msg).then(function(result) {
          console.log(result, "result");
          console.log(msg);

    			$scope.messages.push(msg);
          console.log($scope.messages);
    			$ionicScrollDelegate.scrollBottom();

    			$scope.text = "";

    			SocketService.emit('send:message', msg);

        }).catch(function(err) {
          console.log(err, "error");

      })
		};


    SocketService.on('message', function(msg){
      console.log(msg);
			$scope.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});

    $scope.openConversation = function(x) {
      SocketService.emit('join:room', $scope.room);

      console.log(x);
      store.set('conversation_id', x.conversation_id);
      $state.go('chat',{room:x.conversation_id})

    }

});

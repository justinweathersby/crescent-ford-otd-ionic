app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,$ionicPopup, $ionicLoading, $ionicModal,currentUserService, currentConversation, currentDealerService, dealerService, SocketService, $ionicPlatform, userSvc, currentDealerSvc, store, modalService, $ionicScrollDelegate, DEALERSHIP_API, ChatService, $ionicHistory, $timeout){

  // var me = this;
    $scope.text = "";
		$scope.messages = [];
    $scope.serviceRep = {};

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
  }
    updateConversations();
}); //end of platform ready

  function updateConversations() {
    console.log("updating convos?");
    ChatService.getMessages().then(function(result) {
        console.log(result, "messages");
        $scope.conversations = result.data.data.conversations;
      }).catch(function(err) {
        console.log(err, "error");
    })
  }

  $scope.goBack = function() {
    var unique_id = store.get("unique_id");
    var room = {
        'room_name': unique_id
    };


    SocketService.emit('leave:room', room);
     $state.go('tab.conversations');
  }


  $scope.startServicesChat = function(x) {
    console.log(x);
    store.set('recipient_id', x.id);
    store.set('conversation_id', "");
    store.set('unique_id', x.unique_id);
    var room = {
        'room_name': x.unique_id
    };

    SocketService.emit('join:room', room);

    $scope.chatServicesModal.hide();
  //   $state.go('chat',{room:x.unique_id})
   $state.go('chat',{room:x.unique_id}) //CHANGE TO WHAT? TODO?
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
          dealerService.getServiceReps().then(function(result){
            console.log(result, "result");
            $scope.reps = result.data;
          }).catch(function(err){
            console.log(err, "error");
          })
        });
    }

    $scope.openSalesModal = function() {
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
    var room = store.get('unique_id');
    console.log(room);

    var recipient_id = store.get('recipient_id');
    var conversation_id = store.get('conversation_id');
  			var msg = {
  				'room': room,
  				'user': $scope.currentUser.name,
  				'text': text,
          'recipient_id': recipient_id,
          'conversation_id': conversation_id
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


   $scope.isNotCurrentSender = function(sender_id){

   			if($scope.currentUser.id != sender_id){
   				return 'not-current-user';
   			}
   			return 'current-user';
 		};

    $scope.openConversation = function(x) {
      console.log(x);
        store.set('conversation_id', x.conversation_id);
        store.set('recipient_id', "");
      // $scope.oldMessages = x.messages;
      $scope.currentConvoId = x.conversation_id;

      ChatService.getAllMessages($scope.currentConvoId).then(function(result) {
          console.log(result.data.data.messages, "All messages");
        //  $scope.conversations = result.data.data.conversations;
          $scope.oldMessages = result.data.data.messages;
          console.log($scope.oldMessages);

          modalService
            .chatModal('templates/modals/chatModal.html', $scope)
            .then(function(modal) {
              modal.show();
              $ionicScrollDelegate.scrollBottom();
            });

        }).catch(function(err) {
          console.log(err, "error");

      })
    //  console.log($scope.conversations);
    //  if(x.conversation_id === $scope.conversation)

  //    console.log($scope.oldMessages);
    //  $scope.$apply();
      var room = {
          'room_name': x.unique_id
      };
      SocketService.emit('join:room', room);


      store.set('unique_id', x.unique_id);

    }

    $scope.closeChatModal = function() {
      $scope.chatModal.hide();
      $scope.oldMessages = "";
      console.log("hello");
      updateConversations()
    };

});

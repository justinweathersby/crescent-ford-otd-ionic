app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,$ionicPopup, $ionicLoading, $ionicModal,currentUserService, currentConversation, currentDealerService, dealerService, SocketService, $ionicPlatform, userSvc, currentDealerSvc, store, modalService, $ionicScrollDelegate, DEALERSHIP_API, ChatService, $ionicHistory, $window, $timeout){

  // var me = this;
    $scope.text = "";
		$scope.messages = [];
    $scope.serviceRep = {};

  $ionicPlatform.ready(function() {
    $scope.currentUser = userSvc.getUser();
    console.log($scope.currentUser);
    $scope.dealership = currentDealerSvc.getDealership();
    console.log($scope.dealership);


    $scope.currentUser = store.get('localUser');
    console.log($scope.currentUser);
    $scope.dealership = store.get('localDealership')
    console.log($scope.dealership);
  //}
    updateConversations();

}); //end of platform ready

$scope.$on('cloud:push:notification', function(event, data) {
  var payload = data.message.raw.additionalData.payload;
  console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
  if (payload.user_message == 1){
    if (payload.conversation_id == currentConversation.id){
        updateConversations();
        $rootScope.$apply(function () {
          $rootScope.message_badge_count=0;
        });
      }
    }
  });


// $scope.$on('cloud:push:notification', function(event, data) {
//   console.log('cloud')
//   console.log('convo event', event)
//   console.log('convo data', data)
//   updateConversations();
// });




  function updateConversations() {
    console.log("updating convo conversation");
    ChatService.getMessages().then(function(result) {
        console.log(result, "messages");
        $scope.conversations = result.data.data.conversations;
        console.log($scope.conversations);
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
    // console.log(x.unique_id);

    console.log($scope.reps);
    for (i = 0; i < $scope.reps.length; i++) {
      if($scope.reps[i].name === x) {
        console.log($scope.reps[i].name, "it's a match");
        $scope.currentChatRep = $scope.reps[i]; /// the reps user object
        console.log($scope.currentChatRep.created_at);

      }
    }

    store.set('recipient_id', $scope.currentChatRep.id);
    store.set('conversation_id', "");
    store.set('unique_id', $scope.currentChatRep.id);
    var room = {
        'room_name': $scope.currentChatRep.id
    };


    SocketService.emit('join:room', room);

    $scope.chatServicesModal.hide();

    modalService
      .chatModal('templates/modals/chatModal.html', $scope)
      .then(function(modal) {
        modal.show();
        dealerService.getServiceReps().then(function(result){
          console.log(result, "result");
          $scope.reps = result.data;
        });
})
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

              var reps = []
                for (i = 0; i < $scope.reps.length; i++) {
                //  console.log($scope.reps[i].name, "rep name1");
                  reps.push($scope.reps[i].name);
              }

              var convoReps = [];
                for (i = 0; i < $scope.conversations.length; i++) {
              //    console.log($scope.conversations[i].sender_name, "sender name");
                  convoReps.push($scope.conversations[i].sender_name);
              }
                console.log(reps);
                console.log(convoReps);
                $scope.leftReps = reps.filter(function(x) { return convoReps.indexOf(x) < 0 })
                console.log($scope.leftReps)

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
            $scope.reps = result.data; // change for sales

            var reps = []
              for (i = 0; i < $scope.reps.length; i++) {
              //  console.log($scope.reps[i].name, "rep name1");
                reps.push($scope.reps[i].name);
            }

            var convoReps = [];
              for (i = 0; i < $scope.conversations.length; i++) {
            //    console.log($scope.conversations[i].sender_name, "sender name");
                convoReps.push($scope.conversations[i].sender_name);
            }
              console.log(reps);
              console.log(convoReps);
              $scope.leftReps = reps.filter(function(x) { return convoReps.indexOf(x) < 0 })
              console.log($scope.leftReps)

          }).catch(function(err){
            console.log(err, "error");
          })
        });

    }


  $scope.sendTextMessage = function(text) {

    this.text = null;

    var room = store.get('unique_id');
    console.log(room);

    var recipient_id = store.get('recipient_id');
    var conversation_id = store.get('conversation_id');
    console.log(conversation_id);
    if(conversation_id != "") {
  			var msg = {
  				'room': room,
  				'user': $scope.currentUser.name,
  				'text': text,
          'recipient_id': recipient_id,
          'conversation_id': conversation_id
  			}
        ChatService.saveMessage(msg).then(function(result) {
            console.log(result, "result");
            console.log(msg);
            // $rootScope.$emit('cloud:push:notification', result);
      			$scope.messages.push(msg);
            console.log($scope.messages);
      			$ionicScrollDelegate.scrollBottom();

      			$scope.text = "";

      			SocketService.emit('send:message', msg);

          }).catch(function(err) {
            console.log(err, "error");

        })
      }
    if(conversation_id === "") {
      var msg = {
        'room': room,
        'user': $scope.currentUser.name,
        'text': text,
        'recipient_id': recipient_id
}
ChatService.saveNewMessage(msg).then(function(result) {
    console.log(result, "result");
    console.log(msg);

    $scope.messages.push(msg);
    console.log($scope.messages);
    $ionicScrollDelegate.scrollBottom();


    SocketService.emit('send:message', msg);





  }).catch(function(err) {
    console.log(err, "error");

})
    }
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
      $scope.theConvo = x;
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

      var room = {
          'room_name': x.unique_id
      };
      SocketService.emit('join:room', room);


      store.set('unique_id', x.unique_id);

    }

    $scope.closeChatModal = function() {
      $scope.chatModal.hide();
      $scope.oldMessages = "";
      $scope.messages = [];
      console.log("hello");
      updateConversations()
    };

});

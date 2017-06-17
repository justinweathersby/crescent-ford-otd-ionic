app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,$ionicPopup, $ionicLoading, $ionicModal,currentUserService, currentConversation, currentDealerService, dealerService, SocketService, $ionicPlatform, userSvc, currentDealerSvc, store, modalService, $ionicScrollDelegate, DEALERSHIP_API, ChatService, $ionicHistory, $window, $timeout){

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

		updateConversations();
		var unique_id = store.get("unique_id");
		var room = {
			'room_name': unique_id
		};
		SocketService.emit('leave:room', room);
	}); //end of platform ready

//--------------------------Handles Push Notifications--------------------------
  // -- Commenting this out bc websockets update conversations / messages now
	// $scope.$on('cloud:push:notification', function(event, data) {
	// 	var payload = data.message.raw.additionalData.payload;
	// 	console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
	// 	if (payload.user_message == 1){
	// 		if (payload.conversation_id == currentConversation.id){
	// 			updateConversations();
	// 			$rootScope.$apply(function () {
	// 				$rootScope.message_badge_count=0;
	// 			});
	// 		}
	// 	}
	// });
//------------------------------------------------------------------------------


	function updateConversations() {
		$ionicLoading.show({
			template: '<p>Loading Conversation...</p><ion-spinner></ion-spinner>',
			hideOnStateChange: true,
			duration: 5000
		});

		console.log("updating convo conversation");
		ChatService.getMessages().then(function(result) {
			$ionicLoading.hide();
			console.log(result, "messages");
			$scope.conversations = result.data.data.conversations;
			console.log($scope.conversations);
		}).catch(function(err) {
			$ionicLoading.hide();
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

		modalService.chatModal('templates/modals/chatModal.html', $scope).then(function(modal) {
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
		$ionicLoading.show({
			template: '<p>Loading Representatives...</p><ion-spinner></ion-spinner>',
			hideOnStateChange: true,
			duration: 5000
		});
		modalService.chatServicesModal('templates/modals/select-chat-rep.html', $scope).then(function(modal) {
			$scope.repsModal = modal;
			modal.show();
			dealerService.getServiceReps().then(function(result){
				console.log(result, "result");
				$scope.reps = result.data;

				var reps = []
                for (i = 0; i < $scope.reps.length; i++) {
					//  console.log($scope.reps[i].name, "rep name1");
					reps.push($scope.reps[i]);
				}

				var convoReps = [];
                for (i = 0; i < $scope.conversations.length; i++) {
					//    console.log($scope.conversations[i].sender_name, "sender name");
					convoReps.push($scope.conversations[i].sender_name);
				}
                console.log(reps);
                console.log(convoReps);
                $scope.leftReps = reps.filter(function(x) { return convoReps.indexOf(x) < 0 });
				$ionicLoading.hide();
                console.log($scope.leftReps)
            }).catch(function(err){
				$ionicLoading.hide();
				console.log(err, "error");
            })
        });
    }

    $scope.openSalesModal = function() {
		$ionicLoading.show({
			template: '<p>Loading Representatives...</p><ion-spinner></ion-spinner>',
			hideOnStateChange: true,
			duration: 5000
		});
		modalService.chatServicesModal('templates/modals/select-chat-rep.html', $scope).then(function(modal) {
			$scope.repsModal = modal;
			modal.show();

			dealerService.getSalesReps().then(function(result){
				console.log(result, "result");
				$scope.reps = result.data; // change for sales

				var reps = []
				for (i = 0; i < $scope.reps.length; i++) {
					//  console.log($scope.reps[i].name, "rep name1");
					reps.push($scope.reps[i]);
				}

				var convoReps = [];
				for (i = 0; i < $scope.conversations.length; i++) {
					//    console.log($scope.conversations[i].sender_name, "sender name");
					convoReps.push($scope.conversations[i].sender_name);
				}
				console.log(reps);
				console.log(convoReps);
				$scope.leftReps = reps.filter(function(x) { return convoReps.indexOf(x) < 0 })
				console.log($scope.leftReps);
				$ionicLoading.hide();
			}).catch(function(err){
				console.log(err, "error");
				$ionicLoading.hide();
			})
        });
    }


	$scope.sendTextMessage = function(text) {
		$ionicLoading.show({
			template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
			hideOnStateChange: true,
			duration: 5000
		});

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
				$ionicLoading.hide();
				console.log(result, "result");
				console.log(msg);

      			$scope.messages.push(msg);
				console.log($scope.messages);
      			$ionicScrollDelegate.scrollBottom();

      			$scope.text = "";

      			SocketService.emit('send:message', msg);

			}).catch(function(err) {
				$ionicLoading.hide();
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
				$ionicLoading.hide();
				console.log(result, "result");
				console.log(msg);

				$scope.messages.push(msg);
				console.log($scope.messages);
				$ionicScrollDelegate.scrollBottom();
				SocketService.emit('send:message', msg);
			}).catch(function(err) {
				$ionicLoading.hide();
				console.log(err, "error");
			})
		}
	};

	$scope.isNotCurrentSender = function(sender_id){
		if($scope.currentUser.id != sender_id){
   				return 'not-current-user';
   		}
   		return 'current-user';
 	};

    $scope.openConversation = function(x) {
		console.log(x);
		console.log($scope.currentUser.id);
		console.log(x.sender_id);

			currentConversation.id = x.conversation_id;
			currentConversation.sender_id = x.sender_id;
			currentConversation.sender_name = x.sender_name;

			localforage.setItem('conversation', currentConversation).then(function(value){
				console.log(x.unique_id);
				var room = {
					'room_name': x.unique_id
				};
				SocketService.emit('join:room', room);
				store.set('unique_id', x.unique_id);
				store.set('recipient_id', x.sender_id);
				store.set('conversation_id', x.conversation_id);
				$state.go('tab.messages');
			});
    }

	//-- Triggered on a button click, or some other target
	$scope.showPopup = function(send_to_id) {
		$scope.data = {};
		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			templateUrl: "templates/popups/send-message-input.html",
			cssClass: 'sendMessagePopup',
			title: 'Send A Message To Chat',
			scope: $scope,
			buttons: [
				{ text: 'Cancel',type: 'button-small'},
				{
					text: '<b>Send</b>',
					type: 'button-small button-positive',
					onTap: function(e) {
						if (!$scope.data.msg) {
							e.preventDefault();
						} else {
							startConversation(send_to_id, $scope.data.msg);
							return $scope.data.msg;
						}
					}
				}
			]
		});
		myPopup.then(function(res) {
			console.log('Tapped!', res);
			$scope.repsModal.hide();
		});
	};

	function startConversation(send_to, body){
		$ionicLoading.show({
			template: '<p>Sending Message...</p><ion-spinner></ion-spinner>',
			delay: 500
		});

		var msg = {
			'text': body,
			'recipient_id': send_to
		}
		ChatService.saveNewMessage(msg).then(function(result) {
			console.log(result, "result");
			console.log(msg);
			$ionicLoading.hide();
			currentConversation.id = result.data.data.conversation_id;
			currentConversation.sender_id = result.data.data.partner_id;
			currentConversation.sender_name = result.data.data.partner_name;
			localforage.setItem('conversation', currentConversation).then(function(value){
				console.log(send_to);
				var unique_id = "1911c9b4."+result.data.data.conversation_id;
				var room = {
					'room_name': unique_id
				};
				SocketService.emit('join:room', room);
				store.set('unique_id', unique_id);
				store.set('recipient_id', send_to);
				store.set('conversation_id', result.data.data.conversation_id);
				$state.go('tab.messages');
			});
			$ionicScrollDelegate.scrollBottom();
		}).catch(function(error) {
			$ionicLoading.hide();
			console.log("ERROR::conversationCtrl::startConversation::POST Messages API::", JSON.stringify(error));
		});
	}

    $scope.closeChatModal = function() {
		$scope.chatModal.hide();
		$scope.oldMessages = "";
		$scope.messages = [];
		console.log("hello");
		updateConversations()
    };
});

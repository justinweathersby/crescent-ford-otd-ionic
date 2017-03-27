app.controller('ConversationsCtrl', function($rootScope, $scope, $state, $http, $stateParams, $cordovaBadge,
                                        $ionicPopup, $ionicLoading, $ionicModal,
                                        currentUserService, currentConversation, currentDealerService, dealerService,
                                        DEALERSHIP_API)
{
  $scope.$on('cloud:push:notification', function(event, data) {
    var payload = data.message.raw.additionalData.payload;
    console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
    if (payload.user_message == 1){
        $scope.getConversations();
    }
  });

  $scope.current_user = currentUserService;
  $rootScope.message_badge_count = 0;

  $scope.getConversations = function() {
    if(window.cordova){
      $cordovaBadge.clear();
    }
    console.log("inside getConversations");
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>',
        hideOnStateChange: true,
        duration: 5000
    });

    localforage.getItem('currentUser').then(function(value){
      // currentUserService = value;
        angular.copy(value, currentUserService)

        //-- Load Current Dealer
        localforage.getItem('currentDealer').then(function (value){
          angular.copy(value, currentDealerService);

          dealerService.getSalesReps().success(function(data){
            angular.copy(data, currentDealerService.sales_reps);

            dealerService.getServiceReps().success(function(data){
              angular.copy(data, currentDealerService.service_reps);

              console.log("currentDealerService.sales_reps::",  currentDealerService.sales_reps);
              console.log("currentDealerService.service_reps::",  currentDealerService.service_reps);
              console.log("Calling API for Conversations...");

              $http({ method: 'GET',
                      url: DEALERSHIP_API.url + "/conversations",
                      headers: {'Authorization' : currentUserService.token}
              }).success( function( data ){
                      console.log("Data from conversations: ", JSON.stringify(data, null, 4));
                      $scope.conversations = data.conversations;
                      $ionicLoading.hide();
              }).error( function(error){
                      console.log("Error in Conversations", JSON.stringify(error));
                      if (error.errors === "Not authenticated"){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Error',
                          template: 'Sorry you have been logged out. Please re-login'
                        });
                      }
                      $state.go('login');
                      $ionicLoading.hide();
              }).finally(function() {
                     // Stop the ion-refresher from spinning
                     $scope.$broadcast('scroll.refreshComplete');
                     $ionicLoading.hide();
              });

            }).error(function(error){console.log("ERROR::tabsCtrl::goToChat::getServiceReps()::" + JSON.stringify(error));});
          }).error(function(error){console.log("ERROR::tabsCtrl::goToChat::getSalesReps()::" + JSON.stringify(error));});
        }).catch(function(err){
          console.log("GET ITEM ERROR::loginCtrl::currentDealer::", JSON.stringify(err));
        });
      }).catch(function(err) {console.log("GET ITEM ERROR::LoginCtrl::currentUser", JSON.stringify(err));});
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.getConversations();

  $scope.openConversation = function(convo){
    //--Set Conversation
    console.log("OpenConvo Convo", JSON.stringify(convo,null, 4));
    currentConversation.id = convo.conversation_id;
    currentConversation.sender_id = convo.sender_id;
    currentConversation.sender_name = convo.sender_name;
    currentConversation.sender_image = convo.sender_image;

    localforage.setItem('conversation', currentConversation).then(function(value){
     $state.go('tab.messages');
    });
  };


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
      { text: 'Cancel',
        type: 'button-small'},
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

  //  $scope.token = "";
   localforage.getItem('currentUser').then(function(value){
     currentUserService = value;
     $http({ method: 'POST',
             url: DEALERSHIP_API.url + "/messages",
             data: {
               "message":{
               "body": body
               },
               "recipient_id":send_to
             },
             headers: {'Authorization' : currentUserService.token}
     }).success( function( data ){
             $ionicLoading.hide()

             currentConversation.id = data.conversation_id;
             currentConversation.sender_id = data.partner_id;
             currentConversation.sender_name = data.partner_name;

             localforage.setItem('conversation', currentConversation).then(function(value){
               $state.go('tab.messages');
             });

     }).error( function(error){
             $ionicLoading.hide();
             console.log("ERROR::conversationCtrl::startConversation::POST Messages API::", JSON.stringify(error));
     });
   }).catch(function(err) { console.log("GET ITEM ERROR::Matches::startConversation::", JSON.stringify(err));});
 };

 $ionicModal.fromTemplateUrl('templates/modals/select-chat-rep.html', {
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.repsModal = modal;
     });
     $scope.openRepModal = function(chat_type) {
        if (chat_type == "service"){ $scope.reps = currentDealerService.service_reps; }
        else{ $scope.reps = currentDealerService.sales_reps; }
        $scope.repsModal.show();
     };
     $scope.closeModal = function() {
       $scope.repsModal.hide();
     };
     // Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function() {
       $scope.repsModal.remove();
    });


});

app.controller('TabsCtrl', function($scope, $rootScope, $state, $ionicActionSheet, $ionicHistory, $ionicPlatform, $ionicLoading, $ionicPopup, $cordovaInAppBrowser, $cordovaBadge, $cordovaDialogs,
authService, currentUserService, currentDealerService, dealerService, store, userSvc, currentDealerSvc, ChatService, $ionicPush){

  // function loadMessageCount () {
  //   ChatService.getMessages().then(function(result) {
  //     console.log('get messages');
  //     var conversations = result.data.data.conversations;
  //     var unreadMessageCount = 0;
  //     var readMessages = 0;
  //     angular.forEach(conversations, function(conversation){
  //       if(conversation.recipient_read === false) {
  //         unreadMessageCount ++;
  //       } else {
  //         readMessages ++;
  //       }
  //     })
  //     console.log('unreadmessage count', unreadMessageCount);
  //     console.log('message count', readMessages);
  //     $rootScope.message_badge_count = unreadMessageCount;
  //     $cordovaBadge.hasPermission().then(function(result) {
  //         $cordovaBadge.set(unreadMessageCount);
  //     }, function(error) {
  //         alert(error);
  //     });
  //   })
  // }
  // $ionicPlatform.ready(function() {
  //   loadMessageCount();
  //
  //
  //
  //
  //
  //     $scope.currentUser = userSvc.getUser();
  //     $scope.dealership = currentDealerSvc.getDealership();
  //
  //   if($scope.dealership.id === undefined){
  //     console.log("no current dealership");
  //     //-- Get Current User Object
  //
  //     $scope.currentUser = store.get('localUser');
  //     console.log($scope.currentUser);
  //     $scope.dealership = store.get('localDealership')
  //     console.log($scope.dealership, "tabs");
  //     console.log($scope.dealership.logo_url);
  //
  //   }
  // });




$rootScope.$on('cloud:push:notification', function(event, data) {
  console.log('a new message push', data);
  // console.log('tabs event', events)
  // console.log('tabs data', data)
  // var payload = data.message.raw.additionalData.payload;
  // console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
  // console.log("MESSAGE BADGE COUNT" + $scope.message_badge_count);
  // if (payload.user_message == 1){
  //   // $rootScope.message_badge_count++;
  //   // $rootScope.$apply();
  // }
  // else{
  //   var msg = data.message;
  //   $cordovaDialogs.alert(
  //     msg.text,  // the message
  //     msg.title, // a title
  //     "OK"       // the button text
  //   ).then(function() {
  //     $cordovaBadge.clear();
  //   });
  // }
});

// $rootScope.message_badge_count = 0;

if (currentDealerService){
  $scope.dealership = currentDealerService;
}
else{
    //-- Load Current Dealer
    localforage.getItem('currentDealer').then(function (value){
      angular.copy(value, currentDealerService);
      $scope.dealership = currentDealerService;
    }).catch(function(err){
      console.log("GET ITEM ERROR::loginCtrl::currentDealer::", JSON.stringify(err));
    });
}

function openExternalURL(url, template, alertString){
  if (url){
    if($scope.dealership.iframeFriendly){ $state.go(template);}
    else{ openLinkInBrowser(url);}
  }else{noUrlAlertAndRedirect(alertString);}
};

function openLinkInBrowser(url, redirect){
  console.log("LOG::OPEN IN APP BROWSER, URL::", url);
  console.log("LOG::OPEN IN APP BROWSER, REDIRECT::", redirect);
  $ionicPlatform.ready(function() {
      var options = {
         location: 'no',
         clearcache: 'yes',
         toolbar: 'yes',
         closebuttoncaption: 'Home'
       };

      $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        // success
        console.log("LOG::SUCCESS::OPEN IN APP BROWSER... URL::", url);
        console.log("LOG::SUCCESS::OPEN IN APP BROWSER... EVENT::", event);
      })
      .catch(function(event) {
        // error
          console.log("ERROR::OPEN IN APP BROWSER... EVENT::", event);
          console.log("ERROR::OPEN IN APP BROWSER... URL::", url);
      });


    // $cordovaInAppBrowser.close();
  });

  // $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
  //
  // });
  //
  // $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
    // insert CSS via code / file
    // $cordovaInAppBrowser.insertCSS({
    //   code: 'body {background-color:blue;}'
    // });

    // insert Javascript via code / file
    // $cordovaInAppBrowser.executeScript({
    //   file: 'script.js'
    // });
  // });
  //
  // $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
  //
  // });
  //
  // $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
  //
  // });
};

function noUrlAlertAndRedirect(fromString){
    var alertPopup = $ionicPopup.alert({
      title: "Sorry",
      template: "There is no link to " + fromString
    });
    $state.go('tab.dash');
};

//--Open actionsheet overlay modal
$scope.openHomeModal = function() {

 // Show the action sheet
 var hideSheet = $ionicActionSheet.show({
   buttons: [
     { text: 'Home' },
     { text: 'View All Dealerships' }
   ],
   cancelText: 'Cancel',
   cancel: function() {},
   buttonClicked: function(index) {
     hideSheet();
     switch(index){
       case 0:
       $state.go('tab.dash');
       break;
       case 1:
       $state.go('dealership-list');
       break;
     }

   }
 });
};

$scope.openInventoryModal = function(){
  var hideSheet = $ionicActionSheet.show({
    buttons: [
      { text: 'New Inventory' },
      { text: 'Used Inventory' },
      { text: 'Find Parts'}
    ],
    cancelText: 'Cancel',
    cancel: function() {},
    buttonClicked: function(index) {
      $scope.dealership = store.get('localDealership'); // when hit back button Android $scope.dealership dropped
      hideSheet();
      switch(index){
        case 0:
        openExternalURL($scope.dealership.new_cars_url, "tab.new-cars", "New Cars");
        break;
        case 1:
        openExternalURL($scope.dealership.used_cars_url, "tab.used-cars", "Used Cars");
        break;
        case 2:
        openExternalURL($scope.dealership.parts_url, "tab.parts", "Parts");
        break;
      }

    }
  });
};

$scope.openSpecialsModal = function(){
  var hideSheet = $ionicActionSheet.show({
    buttons: [
      { text: 'Inventory Specials' },
      { text: 'Service Specials' }
    ],
    cancelText: 'Cancel',
    cancel: function() {},
    buttonClicked: function(index) {
      hideSheet();
      switch(index){
        case 0:
        openExternalURL($scope.dealership.specials_url, "tab.specials", "Specials");
        break;
        case 1:
        openExternalURL($scope.dealership.service_specials_url, "tab.service-specials", "Service Specials");
        break;
      }
    }
  });
};

$scope.openMoreModal = function(){
  var hideSheet = $ionicActionSheet.show({
    buttons: [
      { text: 'Financing' },
      { text: 'Logout' }
    ],
    cancelText: 'Cancel',
    cancel: function() {},
    buttonClicked: function(index) {
      hideSheet();
      switch(index){
        case 0:
        openExternalURL($scope.dealership.financing_url, "tab.financing", "Financing");
        break;
        case 1:
        logout();
        break;
      }
    }
  });
};

$scope.goToChat = function(){
  $state.go('tab.conversations');
};

function logout() {
  store.set('localDealership', null);
  store.set('localUser', null);
  // localforage.clear().then(function() {
  //   // Run this code once the database has been entirely deleted.
  //   console.log('Database is now empty.');
  //   authService.resetCurrent();
  //   dealerService.resetCurrent();
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  $state.go('login', {}, {reload:true});
  // }).catch(function(err) {
  //     // This code runs if there were any errors
  //     console.log("ERROR::tabsCtrl::logout::clear::", JSON.stringify(err));
  // });

};
});

app.controller('TabsCtrl', function($scope, $rootScope, $state, SocketService,
                                    $ionicActionSheet, $ionicHistory, $ionicPlatform, $ionicLoading, $ionicPopup, $ionicPush,
                                    $cordovaInAppBrowser, $cordovaBadge, $cordovaDialogs,
                                    authService, currentUserService, currentDealerService, dealerService, store, userSvc, currentDealerSvc, ChatService){

//--------------------------Handles Push Notifications--------------------------
$scope.$on('cloud:push:notification', function(event, data) {
  var payload = data.message.raw.additionalData.payload;
  console.log("PAYLOAD FROM PUSH" + JSON.stringify(payload));
  console.log("MESSAGE BADGE COUNT" + $scope.message_badge_count);
  if (payload.user_message == 1){
    $rootScope.$apply(function () {		
		if($state.current.name !='tab.messages'){
			if(isNAN($rootScope.message_badge_count)){
				$rootScope.message_badge_count = 0;
			}
			$rootScope.message_badge_count++;			
		}		
    });
  }
  else{
    var msg = data.message;
    $cordovaDialogs.alert(
      msg.text,  // the message
      msg.title, // a title
      "OK"       // the button text
    ).then(function() {
      $cordovaBadge.clear();
    });
  }
  $cordovaBadge.promptForPermission();
	$cordovaBadge.hasPermission().then(function(yes) {
		$cordovaBadge.set(3).then(function() {
			// You have permission, badge set.
		  }, function(err) {
			// You do not have permission.
		  });
		// You have permission
	}, function(no) {
		// You do not have permission		
	});  
});

//------------------------------------------------------------------------------

if (currentDealerService){
	$scope.dealership = store.get('localDealership');
}
else{
    //-- Load Current Dealer
    localforage.getItem('currentDealer').then(function (value){
		console.log(currentDealerService);
		console.log(value);
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
  });
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
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
  localforage.clear()
  $state.go('login');
};
});

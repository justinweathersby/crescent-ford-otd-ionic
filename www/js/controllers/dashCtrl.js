app.controller('DashCtrl', function($rootScope,$scope, $sce, $http, $state, $timeout,SocketService,
  $ionicPlatform, $ionicLoading, $ionicPopup, $ionicActionSheet, $ionicHistory,
  currentUserService, currentDealerService, currentDealerSvc, dealerService, userSvc, store,
  DEALERSHIP_API) {

  $ionicPlatform.ready(function() {		
		$scope.currentUser = store.get('localUser');
		console.log($scope.currentUser);
		$scope.dealership = store.get('localDealership')
		console.log($scope.dealership);
  });

  if(currentDealerService.id == null){
    //-- Get Current User Object
    localforage.getItem('currentUser').then(function(value){
      angular.copy(value, currentUserService);
      console.log("After Get currentUser. currentUserService::" + JSON.stringify(currentUserService));      
    }).catch(function(err) {
      $state.go('login');
      console.log("GET ITEM ERROR::LoginCtrl::currentUser", JSON.stringify(err));
    });
  };
  
  SocketService.removeListener('message');
  SocketService.on('message', function(msg){
	  console.log('dashCtrl:: message');	  	  
	  if($scope.currentUser.id == msg.recipient_id){
		console.log(msg);		
		if($state.current.name =='tab.dash'){
			if ($rootScope.message_badge_count === undefined) { 
				$rootScope.message_badge_count = 0;
			}
			$rootScope.message_badge_count = $rootScope.message_badge_count + 1;			
		}
	  }
  });

 $scope.contactSales = function(){
    window.plugin.email.open({
         to:      $scope.dealership.sales_email,
         subject: $scope.dealership.name + ' Sales Inquiry',
         body:    $scope.currentUser.name + ': '
         }, function () {
             $ionicPopup.alert({
                     title: 'Email Not Sent',
                     content: 'You have selected to exit out before sending the email.'
                   });
         },
         currentDealerService);
  };

  $scope.contactService = function(){
    window.plugin.email.open({
         to:      $scope.dealership.service_email,
         subject: $scope.dealership.name + ' Service Inquiry',
         body:    currentUserService.name + ': '
         }, function () {
             $ionicPopup.alert({
                     title: 'Email Not Sent',
                     content: 'You have selected to exit out before sending the email.'
                   });
         },
         this);
  };
  $scope.goToService = function(){
    if($scope.dealership.service_url){
      if($scope.dealership.iframeFriendly){ $state.go('tab.service');}
      else{
        $ionicPlatform.ready(function(){
          window.open($scope.dealership.service_url, '_blank', 'location=no');
        });
      }
    }
    else{
      var alertPopup = $ionicPopup.alert({
        title: "Sorry",
        template: "There is no link to Service"
      });
      $state.go('tab.dash');
    }
  };

  $scope.openSocialMediaBrowser = function(url){
    window.open(url, '_blank', 'location=no');
  };

  $scope.goToMaps = function(){
    window.open($scope.dealership.full_location_string, '_system');
  };

  $scope.callDealership = function(){
    var telephone = 'tel:'+$scope.dealership.phone;
    window.open(telephone, '_system');
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  };
});

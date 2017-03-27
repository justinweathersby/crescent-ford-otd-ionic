app.controller('DashCtrl', function($scope, $sce, $http, $state, $timeout,
                                    $ionicPlatform, $ionicLoading, $ionicPopup, $ionicActionSheet, $ionicHistory,
                                    currentUserService, currentDealerService, dealerService,
                                    DEALERSHIP_API) {



  if(currentDealerService.id == null){
    //-- Get Current User Object
    localforage.getItem('currentUser').then(function(value){
      angular.copy(value, currentUserService);
      console.log("After Get currentUser. currentUserService::" + JSON.stringify(currentUserService));
      dealershipInit();
    }).catch(function(err) {console.log("GET ITEM ERROR::LoginCtrl::currentUser", JSON.stringify(err));});

  }

  //--Initialize Function for Controller
  function dealershipInit() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>',
      hideOnStateChange: true,
      duration: 5000
    });

    dealerService.getDealership().success(function(){
      if ($scope.dealership.id != currentDealerService.id)
      {
        $scope.dealership = currentDealerService;
        $scope.iframeFriendly = currentDealerService.iframeFriendly;
        $scope.dealership.full_location_string = currentDealerService.location;
      }
      $ionicLoading.hide();

    }).error(function(){
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Could Not Get Dealership Profile',
        template: "Please Restart Your App. If This problem continues please contact us."
      });
    });
 };
 //---End Initialize


 $scope.contactSales = function(){
    window.plugin.email.open({
         to:      $scope.dealership.sales_email,
         subject: $scope.dealership.name + ' Sales Inquiry',
         body:    currentUserService.name + ': '
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
    if(currentDealerService.service_url){
      if(currentDealerService.iframeFriendly){ $state.go('tab.service');}
      else{
        $ionicPlatform.ready(function(){
          window.open(currentDealerService.service_url, '_blank', 'location=no');
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

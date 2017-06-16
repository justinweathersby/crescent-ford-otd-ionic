var app = angular.module('crescent-ford-otd', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'angular-storage',
  'btford.socket-io'
]);

app.config(function($ionicCloudProvider, $compileProvider, $ionicConfigProvider){
  $ionicCloudProvider.init({
    "core": {
      "app_id": "1911c9b4"
    },
    "push": {
      "sender_id": "1027849120554",
      "pluginConfig": {
        "ios": {
          "badge": true,
          "alert": true,
          "clearBadge": true
        },
        "android": {
          "iconColor": "#343434",
          "clearBadge": true
        }
      }
    }
  });

  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|map|geo|skype):/);
});

app.run(function($ionicPlatform, $ionicPush, currentUserService, store, $state, $rootScope, $cordovaBadge, ChatService) {

  $ionicPlatform.ready(function() {

    $ionicPush.register().then(function(t) {
      return $ionicPush.saveToken(t);
    }).then(function(t) {
      console.log('my token', t);
      //TODO: save token to db
      currentUserService.device_token = t.token;
      currentUserService.device_type = t.type;

      console.log("DEVICE TOKEN:::::::", t.token);

      localforage.setItem('currentUser', currentUserService).then(function (value){
        console.log("Value set in app.js:", JSON.stringify(value));

      }).catch(function(err){
        console.log("SET ITEM ERROR::app.js::currentUserService::", JSON.stringify(err));
      });
    });

    // TestFairy.begin("993218db594324f249e28bfa5a72f74f0d21732d");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

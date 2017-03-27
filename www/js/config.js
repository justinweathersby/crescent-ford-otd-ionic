app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })
  .state('dealership-list', {
    url: '/dealership-list',
    templateUrl: 'templates/dealership-list.html',
    controller: 'SignupCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  .state('forgot-password', {
    url: '/forgot-password',
    templateUrl: 'templates/forgot-password.html',
    controller: 'LoginCtrl'
  })
  //setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.connect', {
    url: '/connect',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-connect.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.conversations', {
    url: '/conversations',
    cache: false,
    views: {
      'tab-chat': {
        templateUrl: 'templates/tab-conversations.html',
        controller: 'ConversationsCtrl'
      }
    }
  })
  .state('tab.messages', {
    url: '/messages',
    cache: false,
    views: {
      'tab-chat': {
        templateUrl: 'templates/tab-message.html',
        controller: 'MessageCtrl'
      }
    }
  })
  .state('tab.service',{
    url: '/service',
    views: {
      'tab-dash':{
        templateUrl: 'templates/tab-service.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.specials',{
    url: '/specials',
    views: {
      'tab-specials':{
        templateUrl: 'templates/tab-specials.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.service-specials',{
    url: '/service_specials',
    views: {
      'tab-specials':{
        templateUrl: 'templates/tab-service-specials.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.more',{
    url: '/more',
    views: {
      'tab-more':{
        templateUrl: 'templates/tab-more.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.used-cars',{
    url: '/used_cars',
    views: {
      'tab-inventory':{
        templateUrl: 'templates/tab-used-cars.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.new-cars',{
    url: '/new_cars',
    views: {
      'tab-inventory':{
        templateUrl: 'templates/tab-new-cars.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.parts',{
    url: '/parts',
    views: {
      'tab-dash':{
        templateUrl: 'templates/tab-parts.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.financing',{
    url: '/financing',
    views: {
      'tab-financing':{
        templateUrl: 'templates/tab-financing.html',
        controller: 'DashCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login'); //--default go to page
});

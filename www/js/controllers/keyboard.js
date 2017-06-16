app.directive('fix', function ($window, $ionicPlatform) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
           if ($ionicPlatform.is('ios')) {
              console.log("fix keyboard");
                angular.element($window).bind('native.keyboardshow', function (el) {
                  console.log(el);
                        var kh = el.keyboardHeight;
                        var keyTop = kh - 46;
                        var content = angular.element(document.querySelector('#footerChat'));
                        element[0].style.setProperty("bottom", keyTop + "px", "important");
                        content[0].style.setProperty("bottom", kh + "px", "important");
                });
           }
        }
    };
})

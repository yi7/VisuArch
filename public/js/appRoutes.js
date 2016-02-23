// public/js/appRoutes.js

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/taxi', {
            templateUrl: 'views/taxi.html',
            controller: 'TaxiController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);

}]);

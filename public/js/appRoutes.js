// public/js/appRoutes.js

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        .when('/taximongo', {
            templateUrl: 'views/taxiM.html',
            controller: 'TaxiMController'
        })
        .when('/taxifire', {
            templateUrl: 'views/taxiF.html',
            controller: 'TaxiFController'
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);

// public/js/controllers/MainCtrl.js
var app = angular.module('MainCtrl', []);

app.controller('MainController', function($scope, $http) {
        
        $scope.tagline = 'Testing Main Controller';

});

app.directive('yokagauge', function() {
    return {
        restrict: 'E',
        template: '<svg id="fillgauge1" width="19%" height="200%"></svg>' +
                    '<svg id="fillgauge2" width="19%" height="200%"></svg>',
        link: function(scope, elem, attrs) {
            var config1 = liquidFillGaugeDefaultSettings();
            config1.circleColor = "#FF7777";
            config1.textColor = "#FF4444";
            config1.waveTextColor = "#FFAAAA";
            config1.waveColor = "#FFDDDD";
            config1.circleThickness = 0.2;
            config1.textVertPosition = 0.2;
            config1.waveAnimateTime = 1000;
            var gauge1 = loadLiquidFillGauge("fillgauge1", 55, config1);
            var gauge2 = loadLiquidFillGauge("fillgauge2", 55);
        }
    }
});

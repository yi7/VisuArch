// public/js/controllers/TaxiCtrl.js
var app = angular.module('TiaaMCtrl', []);

app.controller('TiaaMController', function($scope, $filter, TiaaMongo) {

    $scope.change = function(date) {
        var selected_date = $filter('date')(date, 'M/dd/yyyy');

        TiaaMongo.query('TRN TRADE_DATE CASH').then(function(response) {
            var data_list = [];
            var obj_list = {};

            for( var i = 0; i < response.data.length; i++) {
                if(response.data[i].TRADE_DATE != selected_date) {
                    continue;
                }

                if(response.data[i].TRN in obj_list) {
                    obj_list[response.data[i].TRN] += response.data[i].CASH;
                } else {
                    obj_list[response.data[i].TRN] = response.data[i].CASH;
                }
            }

            for(var obj in obj_list) {
                data = {
                    value: obj_list[obj].toString(),
                    label: "TRN: " + obj,
                    valuePrefix: "CASH: "
                }
                data_list.push(data);
            }

            d3.select('svg').remove(); // remove old svg chart

            if(data_list.length == 0) {
                d3.select('#rectAreaChart')
                    .append('p')
                    .text('no date available to chart');
                return;
            } else {
                d3.select('p').remove();
            }

            d3.select('#rectAreaChart') // create a new one to draw chart to
                .append('svg')
                .attr('id', 'rectangularareachart1')
                .attr('width', '100%')
                .attr('height', '250px');

            var config1 = rectangularAreaChartDefaultSettings();
            config1.expandFromLeft = true;
            config1.expandFromTop = true;
            config1.colorsScale = d3.scale.category20b();
            loadRectangularAreaChart("rectangularareachart1", data_list, config1);
        });
    };

    TiaaMongo.query(1753469,'TRN TRADE_DATE CASH').then(function(response) {
        console.log(response.data);
    });

});

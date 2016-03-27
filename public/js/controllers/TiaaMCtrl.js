// public/js/controllers/TaxiCtrl.js
var app = angular.module('TiaaMCtrl', []);

app.controller('TiaaMController', function($scope, $http, TiaaMongo) {
    TiaaMongo.query('TRN TRADE_DATE CASH').then(function(response) {
        var data_list = [];
        var obj_list = {};

        for( var i = 0; i < response.data.length; i++) {
            if(response.data[i].TRADE_DATE != '7/28/2015') {
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

        var config1 = rectangularAreaChartDefaultSettings();
        config1.expandFromLeft = true;
        config1.expandFromTop = true;
        config1.colorsScale = d3.scale.category20b();
        loadRectangularAreaChart("rectangularareachart1", data_list, config1);
    });
});

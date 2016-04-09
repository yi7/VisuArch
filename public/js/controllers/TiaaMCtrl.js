// public/js/controllers/TaxiCtrl.js
var app = angular.module('TiaaMCtrl', []);

app.controller('TiaaMController', function($scope, $filter, TiaaMongo) {

    /*$scope.change = function(date) {
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
    };*/

    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        TiaaMongo.query($scope.TRN,'TRN TRADE_DATE CATEGORY SUB_CATEGORY CASH').then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
            }
        });
    }

    // Overview Information
    TiaaMongo.query(' ','CASH').then(function(response) {
        var total = 0;
        var transactions = response.data.length;
        for(var i = 0; i < transactions; i++) {
            total += response.data[i].CASH;
        }
        var average = total / transactions;

        $scope.total_cash = Math.round(total).toLocaleString();
        $scope.average_cash = Math.round(average).toLocaleString();
        $scope.total_transaction = transactions;
    });

    // Category Information. Creates Liquid Gauge per Category
    TiaaMongo.query(' ','CATEGORY').then(function(response) {
        var transactions = response.data.length;
        result = {};
        for(var i = 0; i < transactions; i++) {
            if(!result[response.data[i].CATEGORY]) {
                result[response.data[i].CATEGORY] = 0;
            }
            result[response.data[i].CATEGORY]++;
        }

        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleThickness = 0.2;
        config1.circleColor = "#178bca";
        config1.textColor = "#ffffff";
        config1.waveTextColor = "#ffffff";
        config1.waveColor = "#178bca";
        config1.waveHeight = 0.15;
        config1.waveAnimateTime = 1000;

        var i = 1;
        for(var category in result) {
            if(category == "") {
                d3.select("#fillgauge" + i)
                    .append("div")
                    .attr("id", "none");
            } else {
                d3.select("#fillgauge" + i)
                    .append("div")
                    .attr("id", category);
            }

            var percentage = Math.round(result[category] / transactions * 100);
            loadLiquidFillGauge("fillgauge" + i++, percentage, config1);
        }
    });

    // Liquid Guage Selection. Highlights the selected liquid gauge
    $scope.display = false;
    $scope.select = function(id) {
        d3.selectAll("svg").select("g").select("path").style("fill", "#178bca");
        d3.selectAll("svg").select("g").select("g").select("circle").style("fill", "#178bca");

        d3.select("#" + id).select("g").select("path").style("fill", "#f5a623");
        d3.select("#" + id).select("g").select("g").select("circle").style("fill", "#f5a623");

        $scope.display = true;
        var category = d3.select("#" + id).select("div").attr("id");
    }
});

// Directive for the modal.
app.directive('modal', function () {
    return {
        template:   '<div class="modal fade">' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                                    '<h4 class="modal-title" style="text-align: center;">' +
                                        '<font color="6d7173">{{ title }}</font>' +
                                    '</h4>' +
                                '</div>' +
                                '<div class="modal-body" ng-transclude></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            //scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
  });
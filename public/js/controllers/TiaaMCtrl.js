var app = angular.module('TiaaMCtrl', []);

app.controller('TiaaMController', function($scope, $filter, TiaaMongo) {
    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        TiaaMongo.query('TRN', $scope.TRN, 'TRN TRADE_DATE CATEGORY SUB_CATEGORY CASH').then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
            }
        });
    }

    // Overview Information
    TiaaMongo.query(' ', ' ', 'CASH').then(function(response) {
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
    TiaaMongo.query(' ', ' ', 'CATEGORY').then(function(response) {
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
        if(d3.select("#" + id).select("div").empty()) {
            return;
        }

        d3.select("#gauge_display")
            .selectAll("svg")
            .select("g")
            .select("path")
            .style("fill", "#178bca");

        d3.select("#gauge_display")
            .selectAll("svg")
            .select("g")
            .select("g")
            .select("circle")
            .style("fill", "#178bca");

        d3.select("#" + id).select("g").select("path").style("fill", "#f5a623");
        d3.select("#" + id).select("g").select("g").select("circle").style("fill", "#f5a623");

        $scope.display = true;
        var category = d3.select("#" + id).select("div").attr("id");
        if(category == "none") {
            $scope.category = "No Category";
            category = ' ';
        } else {
            $scope.category = category;
        }

        // Info window for selected liquid gauge
        TiaaMongo.query('CATEGORY', category, 'CATEGORY SUB_CATEGORY CASH').then(function(response) {
            var total = 0;
            var transactions = response.data.length;
            var min = response.data[0].CASH;
            var max = response.data[0].CASH;
            result = {};
            for(var i = 0; i < transactions; i++) {
                total += response.data[i].CASH;
                if(response.data[i].CASH > max) {
                    max = response.data[i].CASH;
                }
                if(response.data[i].CASH < min) {
                    min = response.data[i].CASH;
                }

                if(!result[response.data[i].SUB_CATEGORY]) {
                    result[response.data[i].SUB_CATEGORY] = 0;
                }
                result[response.data[i].SUB_CATEGORY]++;
            }
            var average = (total / transactions).toFixed(2);

            $scope.total = total.toLocaleString();
            $scope.average = parseFloat(average).toLocaleString();
            $scope.max = max.toLocaleString().toLocaleString();
            $scope.min = min.toLocaleString();
            $scope.trans = transactions;


            // Rect Area Chart for selected Liquid Gauge
            d3.select("#rect_display").selectAll("svg").remove();

            var config1 = rectangularAreaChartDefaultSettings();
            config1.expandFromLeft = true;
            config1.expandFromTop = true;
            config1.colorScale = d3.scale.category20b();
            config1.displayValueText = false;
            config1.maxValue = 100;

            var i = 1;
            for(var category in result) {
                if(i % 2 == 0) {
                    config1.colorsScale = d3.scale.ordinal().range(["#235676"]);
                } else {
                    config1.colorsScale = d3.scale.ordinal().range(["#37779d"]);
                }

                var data = [];
                var percent = Math.round(result[category] / transactions * 100).toString();
                var obj = {
                    value: percent,
                    label: category + ": " + percent + "%"
                }
                data.push(obj);

                d3.select("#rect_display")
                    .append("svg")
                    .attr("id", "rectChart" + i)
                    .attr("width", "100%")
                    .attr("height", "18px")
                loadRectangularAreaChart("rectChart" + i++, data, config1);
            }
        });
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

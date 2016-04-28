var app = angular.module('FirebaseCtrl', []);

app.controller('TiaaFirebaseController', function($scope, $filter, Tiaa) {
    var timerStart = Date.now();

    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        Tiaa.firebaseQuery('TRN', $scope.TRN).then(function(response) {
            var searchTotal = 0;
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
                searchTotal += response.data[i].CASH;
            }
            $scope.searchTotal = searchTotal;
        });
    }

    // Overview Information
    Tiaa.firebaseGetAll().then(function(response) {
        var total = 0;
        var transactions = response.data.length;
        var result = {}; // dictionary to count CATEGORY, used for Category section
        var trancodes = {};
        for(var i = 0; i < transactions; i++) {
            total += response.data[i].CASH;

            if(!result[response.data[i].CATEGORY]) {
                result[response.data[i].CATEGORY] = 0;
            }
            result[response.data[i].CATEGORY]++;

            if(!trancodes[response.data[i].TRAN_CODE]) {
                trancodes[response.data[i].TRAN_CODE] = response.data[i].TRAN_CODE;
            }
        }
        var average = total / transactions;

        $scope.total_cash = Math.round(total).toLocaleString();
        $scope.total_average = Math.round(average).toLocaleString();
        $scope.total_transaction = transactions;

        // =======================================================
        // Linechart Section shows Cash vs Trade Date

        // =======================================================
        // Category Information. Creates Liquid Gauge per Category
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
            d3.select("#fillgauge" + i)
                .append("div")
                .attr("id", category);

            var percentage = Math.round(result[category] / transactions * 100);
            loadLiquidFillGauge("fillgauge" + i++, percentage, config1);
        }

        // Splitting Trancodes into two columns
        var codes = Object.keys(trancodes).length;
        var i = 0;
        $scope.trancodes_left = [];
        $scope.trancodes_right = [];
        for(var trancode in trancodes) {
            if(i % 2 == 0) {
                $scope.trancodes_left.push(trancode);
            } else {
                $scope.trancodes_right.push(trancode);
            }
            i++;
        }

        // timer to calculate page load time for overview
        $scope.timer = (Date.now() - timerStart) / 1000 % 60;
    });

    // Liquid Guage Selection. Highlights the selected liquid gauge
    $scope.display = false;
    $scope.rect_display = false;
    $scope.select_gauge = function(id, color) {
        $scope.display = true;
        $scope.rect_display = true;

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

        d3.select("#infoBox").select("table").attr("style", "width: 100%; background-color: " + color + ";");
        d3.select("#" + id).select("g").select("path").style("fill", color);
        d3.select("#" + id).select("g").select("g").select("circle").style("fill", color);

        var category = d3.select("#" + id).select("div").attr("id");
        $scope.category = category;

        // Info window for selected liquid gauge
        Tiaa.firebaseQuery('CATEGORY', category).then(function(response) {
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

            // =========================================
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
                config1.colorsScale = d3.scale.ordinal().range(["#37779d", color]);

                var data = [];
                var percent = Math.round(result[category] / transactions * 100).toString();
                var obj = {
                    value: percent,
                    label: category + ": " + percent + "%"
                }
                var obj2 = {
                    value: "100"
                }
                data.push(obj);
                data.push(obj2);

                d3.select("#rect_display")
                    .append("svg")
                    .attr("id", "rectChart" + i)
                    .attr("width", "100%")
                    .attr("height", "18px")
                loadRectangularAreaChart("rectChart" + i++, data, config1);
            }
        });
    }

    $scope.select_tran = function(code) {
        $scope.display = true;
        console.log(code);
    }
});
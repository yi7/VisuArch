var app = angular.module('MongoCtrl', []);

app.controller('TiaaMongoController', function($scope, $filter, Tiaa) {
    var timerStart = Date.now();

    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        Tiaa.mongoQuery('TRN', $scope.TRN).then(function(response) {
            var searchTotal = 0;
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
                searchTotal += response.data[i].CASH;
            }
            $scope.searchTotal = searchTotal;
        });
    }

    // Overview Information
    $scope.stub = false; // flag for table row stub
    Tiaa.mongoGetAll().then(function(response) {
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

        // ===================================================================
        // Trancode-Activity Information: Splitting Trancodes into two columns
        var total_trancode = Object.keys(trancodes).length;
        var i = 0;
        $scope.trancodes_left = [];
        $scope.trancodes_right = [];
        var trancode_to_desc = {
            114: "Contributions",
            301: "Adjustments",
            366: "Transfers",
            394: "Transfers",
            395: "Transfers",
            414: "Distributions",
            444: "Distributions",
            588: "OmniScript"
        }
        for(var trancode in trancodes) {
            if(i % 2 == 0) {
                $scope.trancodes_left.push(trancode_to_desc[trancode] + ' (' + trancode + ')');
            } else {
                $scope.trancodes_right.push(trancode_to_desc[trancode] + ' (' + trancode + ')');
            }
            i++;
        }

        // if odd number of activity, add a stub table row
        if(total_trancode % 2 != 0) {
            $scope.stub = true;
        }

        // timer to calculate page load time for overview
        $scope.timer = (Date.now() - timerStart) / 1000 % 60;
    });

    // Liquid Guage Selection. Highlights the selected liquid gauge
    $scope.display = false; // flag for overall bottom display
    $scope.rect_display = false; // flag for bar chart display
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
        Tiaa.mongoQuery('CATEGORY', category).then(function(response) {
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

    $scope.select_trancode = function(code) {
        $scope.display = true;
        $scope.tran_display = true;

        var regExp = /\(([^)]+)\)/; // regex to get between paranthesis
        var extract = regExp.exec(code);

        Tiaa.mongoQuery('TRAN_CODE', extract[1]).then(function(response) {
            var combination = {};
            var transactions = response.data.length;
            for(var i = 0; i < transactions; i++) {
                var combo = response.data[i].TRAN_CODE + '-' + response.data[i].ACTIVITY;
                if(!combination[combo]) {
                    combination[combo] = 0;
                }
                combination[combo]++;
            }

            d3.select("#tran_display").selectAll("svg").remove();

            var config1 = rectangularAreaChartDefaultSettings();
            config1.expandFromLeft = true;
            config1.expandFromTop = true;
            config1.colorScale = d3.scale.category20b();
            config1.displayValueText = false;
            config1.maxValue = 100;

            var activity_to_desc = {
                1: "Contribution Received",
                2: "Cash Earnings",
                12: "Plan Transfer In",
                23: "Termination Distribution",
                24: "Miscellaneous Debit",
                25: "Withdrawal Distribution",
                59: "Plan Transfer Out"
            }
            var i = 1;
            for(var combo in combination) {
                config1.colorsScale = d3.scale.ordinal().range(["#235676"]);
                var split = combo.split('-'); // 0-tran 1-activity
                var data = [];
                var percent = (combination[combo] / transactions * 100).toFixed(1).toString();
                var obj = {
                    value: "100",
                    label: activity_to_desc[split[1]] + " (" + split[1] + ") : " + percent + "%"
                }
                data.push(obj);

                d3.select("#tran_display")
                    .append("svg")
                    .attr("id", "rectChartB" + i)
                    .attr("width", "100%")
                    .attr("height", "18px")
                loadRectangularAreaChart("rectChartB" + i++, data, config1);
            }
        });
    }
});

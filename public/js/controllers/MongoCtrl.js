var app = angular.module('MongoCtrl', []);

app.controller('TiaaMongoController', function($scope, $filter, Tiaa) {
    // Modal Popup. User enters a TRN (ex.2055745) in the searchbox
    $scope.showModal = false;
    $scope.search = function() {
        $scope.showModal = !$scope.showModal;
        $scope.title = $scope.TRN;
        $scope.transactions = [];
        Tiaa.mongoQuery('TRN', $scope.TRN).then(function(response) {
            for(var i = 0; i < response.data.length; i++) {
                $scope.transactions.push(response.data[i]);
            }
        });
    }

    // Overview Information
    Tiaa.mongoGetAll().then(function(response) {

        var total = 0;
        var transactions = response.data.length;
        var categories = {}; // dictionary to count CATEGORY, used for Category section
        var trancode = {};
        var tranCash = {};
        var lineData = [];


        // loops through all transactions
        for(var i = 0; i < transactions; i++) {
            total += response.data[i].CASH;

            if(!categories[response.data[i].CATEGORY]) {
                categories[response.data[i].CATEGORY] = 0;
            }
            categories[response.data[i].CATEGORY]++;

            if(!trancode[response.data[i].TRAN_CODE]) {
                trancode[response.data[i].TRAN_CODE] = 0;
            }
            trancode[response.data[i].TRAN_CODE]++;

            if(!tranCash[response.data[i].TRADE_DATE]) {
                tranCash[response.data[i].TRADE_DATE] = 0;
            }
            tranCash[response.data[i].TRADE_DATE] += response.data[i].CASH;
        }
        var average = total / transactions;


        for (var value in tranCash) {
          var date = value;
          var cash = tranCash[value];
          var a = {"x":date, "y":cash};
          lineData.push(a);
        }

        for (var data in lineData) {
          console.log(lineData[data].x + ": " lineData[data].y);
        }

        $scope.total_cash = Math.round(total).toLocaleString();
        $scope.total_average = Math.round(average).toLocaleString();
        $scope.total_transaction = transactions;

        // =======================================================
        // Category Information. Creates Liquid Gauge per Category
        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleThickness = 0.2;
        config1.circleColor = "#178bca";
        config1.textColor = "#ffffff";
        config1.waveTextColor = "#ffffff";
        config1.waveColor = "#178bca";
        config1.waveHeight = 0.1;
        config1.waveAnimateTime = 1000;

        var i = 1;
        for(var category in categories) {
            d3.select("#fillgauge" + i)
                .append("div")
                .attr("id", category);

            var percentage = Math.round(categories[category] / transactions * 100);
            loadLiquidFillGauge("fillgauge" + i++, percentage, config1);
        }

        // table row of unique TRAN_CODE
        $scope.tran_codes = [];
        for(var tran_code in trancode) {
            $scope.tran_codes.push({
                "code": tran_code,
                "percent": parseFloat(trancode[tran_code] / transactions * 100).toFixed(1)
            });
        }
    });

    // Liquid Guage Selection. Highlights the selected liquid gauge
    $scope.display = false;
    $scope.select = function(id) {
        // check to make sure the id I inserted exists, otherwise ignore
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
        $scope.category = category;

        // Info window for selected liquid gauge
        Tiaa.mongoQuery('CATEGORY', category).then(function(response) {
            var total = 0;
            var transactions = response.data.length;
            var min = response.data[0].CASH;
            var max = response.data[0].CASH;
            categories = {};
            for(var i = 0; i < transactions; i++) {
                total += response.data[i].CASH;
                if(response.data[i].CASH > max) {
                    max = response.data[i].CASH;
                }
                if(response.data[i].CASH < min) {
                    min = response.data[i].CASH;
                }

                if(!categories[response.data[i].SUB_CATEGORY]) {
                    categories[response.data[i].SUB_CATEGORY] = 0;
                }
                categories[response.data[i].SUB_CATEGORY]++;
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
            for(var category in categories) {
                config1.colorsScale = d3.scale.ordinal().range(["#37779d", "#235676"]);

                var data = [];
                var percent = Math.round(categories[category] / transactions * 100).toString();
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

    $scope.display_tran = false;
    $scope.select_tran = function(tran_code) {
        if(!d3.select("#aster_display").select("svg").empty()) {
            d3.select("#aster_display").select("svg").remove();
        }

        d3.select("#trancodeTable")
            .select("tbody")
            .selectAll("tr")
            .select("td")
            .select("a")
            .select("div")
            .attr("style", "width: 100%; height: 100%; padding: 7px; background-color: #178bca");

        d3.select("#info" + tran_code.code)
            .attr("style", "width: 100%; height: 100%; padding: 7px; background-color: #f5a623;");

        $scope.display_tran = true;
        Tiaa.mongoQuery('TRAN_CODE', parseInt(tran_code.code)).then(function(response) {
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

            var i = 1;
            for(var combo in combination) {
                config1.colorsScale = d3.scale.ordinal().range(["#37779d", "#235676"]);
                var split = combo.split('-'); // 0-tran 1-activity
                var data = [];
                var percent = Math.round(combination[combo] / transactions * 100).toString();
                var obj = {
                    value: percent,
                    label: split[1] + ": " + percent + "%"
                }
                var obj2 = {
                    value: "100"
                }
                data.push(obj);
                data.push(obj2);

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

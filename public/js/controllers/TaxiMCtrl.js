// public/js/controllers/TaxiCtrl.js
var app = angular.module('TaxiMCtrl', []);

app.controller('TaxiMController', function($scope, $http, TaxiMongo) {
        $scope.tagline = 'Data used to make charts below are stored in mongo';

        TaxiMongo.query('tip_amount').then(function(response) {
            var yesTip = 0;
            var noTip = 0;

            for( var i = 0; i < response.data.length; i++) {
                if(response.data[i].tip_amount != 0) {
                    yesTip++;
                } else {
                    noTip++;
                }
            }

            //console.log(response.data);
            var yesPer = Math.round(yesTip / response.data.length * 100);
            var config1 = liquidFillGaugeDefaultSettings();
            config1.circleColor = "#FF7777";
            config1.textColor = "#FF4444";
            config1.waveTextColor = "#FFAAAA";
            config1.waveColor = "#FFDDDD";
            config1.circleThickness = 0.2;
            config1.textVertPosition = 0.2;
            config1.waveAnimateTime = 1000;
            var gauge1 = loadLiquidFillGauge("fillgauge1", yesPer, config1);
        });

        TaxiMongo.query('passenger_count').then(function(response) {
            var pCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};

            for( var i = 0; i < response.data.length; i++) {
                pCount[response.data[i].passenger_count]++;
            }

            var bardata = [pCount[1], pCount[2], pCount[3], pCount[4], pCount[5], pCount[6]];
            /*var piedata = [yesTip, noTip];

            makePieChart(piedata);*/
            makeBarChart(bardata);
        });
});

function makePieChart(data) {
    d3.select(".descriptionPie").append("p").text("Percentage of people who tip");
    var canvas = d3.select(".piechart");

    var color = d3.scale.ordinal()
        .range(["#FF7777", "#178BCA", "orange", "yellow", "green", "cyan"]);

    var group = canvas.append("g")
        .attr("transform", "translate(200, 200)");

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(200);

    var pie = d3.layout.pie()
        .value(function(d) { return d });

    var arcs = group.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) { return color(d.data)});

    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .text(function(d, i) {
            if(i == 0) {
                return 'Tip';
            } else {
                return 'No Tip';
            }
        });
}

function makeBarChart(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1, 1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(".barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    x.domain(data.map(function(d, i) { return i + 1; }));
    y.domain([0, d3.max(data, function(d) { return d; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".8em")
        .style("text-anchor", "end")
        .text("% Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(i + 1); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); });
}

/*app.directive('yokagauge', function() {
    return {
        restrict: 'E',
        template: '<svg id="fillgauge1" width="97%" height="250%"></svg>',
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
        }
    }
});*/

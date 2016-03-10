// public/js/controllers/TaxiCtrl.js
var app = angular.module('TaxiMCtrl', []);

app.controller('TaxiMController', function($scope, $http, TaxiMongo) {
        $scope.tagline = 'Data used to make charts below are stored in mongo';

        TaxiMongo.getAll().then(function(response) {
            var pCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};

            for( var i = 0; i < response.data.length; i++) {
                pCount[response.data[i].passenger_count]++;
            }

            var data = [pCount[1], pCount[2], pCount[3], pCount[4], pCount[5], pCount[6]];

            makePieChart(data);

        });

        d3.select(".descriptionLiquid").append("p").text("$ of fairs");

});

function makePieChart(data) {
    d3.select(".descriptionPie").append("p").text("Number of passengers in cab");
    var canvas = d3.select(".piechart");

    var color = d3.scale.ordinal()
        .range(["red", "blue", "orange", "yellow", "green", "cyan"]);

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
        .text(function(d, i) { return i + 1; });
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

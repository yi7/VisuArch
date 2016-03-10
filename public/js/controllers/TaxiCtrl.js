// public/js/controllers/TaxiCtrl.js
angular.module('TaxiCtrl', [])

    .controller('TaxiController', function($scope, $http, Taxi) {

        $scope.tagline = 'Test Taxi Controller';

        var canvas = d3.select(".chart");

        Taxi.getAll().then(function(response) {
            var pCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};

            for( var i = 0; i < response.data.length; i++) {
                pCount[response.data[i].passenger_count]++;
            }

            var data = [pCount[1], pCount[2], pCount[3], pCount[4], pCount[5], pCount[6]];
            var r = 300;

            var color = d3.scale.ordinal()
                .range(["red", "blue", "orange", "yellow", "green", "cyan"]);

            var group = canvas.append("g")
                .attr("transform", "translate(300, 300)");

            var arc = d3.svg.arc()
                .innerRadius(200)
                .outerRadius(300);

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
            /*canvas.selectAll("rect")
                //.data(pCount)
                //.enter()
                    .append("rect")
                    .attr("width", 30)
                    .attr("height", 28)
                    //.attr("y", function(d, i) { return i * 50 })
                    .attr("fill", "red");*/
            //$scope.taxis = response.data;

        });
});

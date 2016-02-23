// public/js/controllers/TaxiCtrl.js
angular.module('TaxiCtrl', [])

    .controller('TaxiController', function($scope, $http, Taxi) {

        $scope.tagline = 'Test Taxi Controller';

        var canvas = d3.select("svg")
            .attr("width", 500)
            .attr("height", 500)

        var circle = canvas.append("circle")
            .attr("cx", 250)
            .attr("cy", 250)
            .attr("r", 50)
            .attr("fill", "red");

        var rect = canvas.append("rect")
            .attr("width", 100)
            .attr("height", 50);

        var line = canvas.append("line")
            .attr("x1", 0)
            .attr("y1", 100)
            .attr("x2", 400)
            .attr("y2", 400)
            .attr("stroke", "yellow")
            .attr("stroke-width", 2);

        /*Taxi.getAll().then(function(response) {
            if(response) {
            d3.json(response.data, function(data) {
                canvas.selectAll("rect")
                    .data(data)
                    .enter()
                        .append("rect")
                        .attr("width", function(d) { return d.passenger_count * 10; })
                        .attr("height", 28)
                        .attr("y", function(d, i) { return i * 50; })
                        .attr("fill", "red")
            });
            }
            //console.log(response);
        });*/
});

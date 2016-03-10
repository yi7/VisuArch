// app/routes/taxi.route

var Taxi = require('../models/taxi');

module.exports = function(router) {
    // on routes that end in /taxis
    // ----------------------------------------------------
    router.route('/mongotaxis')

        // create a taxi (accessed at POST http://localhost:3000/api/taxis)
        .post(function(req, res) {
            var taxi = new Taxi(); // create a new instance of the Taxi model

            // set the taxi data (comes from the request)
            taxi.passenger_count = req.body.passenger_count;
            taxi.trip_distance = req.body.trip_distance;
            taxi.pickupCoordinates.longitude = req.body.pickupCoordinates.longitude;
            taxi.pickupCoordinates.latitude = req.body.pickupCoordinates.latitude;
            taxi.dropoffCoordinates.longitude = req.body.dropoffCoordinates.longitude;
            taxi.dropoffCoordinates.latitude = req.body.dropoffCoordinates.latitude;
            taxi.tip_amount = req.body.tip_amount;
            taxi.total_amount = req.body.total_amount;

            // save the taxi and check for errors
            taxi.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Taxi Created' });
            });
        })

        // get all the taxis (accessed at GET http://localhost:3000/api/taxis)
        .get(function(req, res) {
            Taxi.find(function(err, taxis) {
                if (err)
                    res.send(err);

                res.json(taxis);
            });
        });


    // on routes that end in /taxis/:taxi_id
    // ----------------------------------------------------
    router.route('/mongotaxis/:taxi_id')

        // get the taxi with that id (accessed at GET http://localhost:3000/api/taxis/:taxi_id)
        .get(function(req, res) {
            Taxi.findById(req.params.taxi_id, function(err, taxi) {
                if (err)
                    res.send(err);
                res.json(taxi);
            });
        })

        .put(function(req, res) {

            // use our taxi model to find the taxi we want
            Taxi.findById(req.params.taxi_id, function(err, taxi) {

                if (err)
                    res.send(err);

                // update the taxi data
                taxi.passenger_count = req.body.passenger_count;
                taxi.trip_distance = req.body.trip_distance;
                taxi.pickupCoordinates.longitude = req.body.taxi_id.pickupCoordinates.longitude;
                taxi.pickupCoordinates.latitude = req.body.taxi_id.pickupCoordinates.latitude;
                taxi.dropoffCoordinates.longitude = req.body.taxi_id.dropoffCoordinates.longitude;
                taxi.dropoffCoordinates.latitude = req.body.taxi_id.dropoffCoordinates.latitude;
                taxi.tip_amount = req.body.tip_amount;
                taxi.total_amount = req.body.total_amount;

                // save the taxi
                taxi.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'taxi updated!' });
                });

            });
        })

        // delete the taxi with this id (accessed at DELETE http://localhost:3000/api/taxis/:taxi_id)
        .delete(function(req, res) {
            Taxi.remove({
                _id: req.params.taxi_id
            }, function(err, taxi) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });
}

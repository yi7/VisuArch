var firebase = require('firebase');
var url = 'https://blinding-heat-7423.firebaseio.com/';

module.exports = function(router) {

    router.route('/firetaxis')

        .post(function(req, res) {
            var ref = new Firebase(url);

            var onComplete = function(error) {
                if(error) {
                    console.log('Unable to push');
                } else {
                    res.json({ message: 'Taxi Created' });
                }
            };

            ref.push(
                {
                    'dropoffCoordinates': {
                        'latitude': req.body.dropoffCoordinates.latitude,
                        'longitude': req.body.dropoffCoordinates.longitude
                    },
                    'passenger_count': req.body.passenger_count,
                    'pickupCoordinates': {
                        'latitude': req.body.pickupCoordinates.latitude,
                        'longitude': req.body.pickupCoordinates.longitude
                    },
                    'tip_amount': req.body.tip_amount,
                    'total_amount': req.body.total_amount,
                    'trip_distance': req.body.trip_distance
                },
                onComplete
            );
        })

        .get(function(req, res) {
            var ref = new Firebase(url);
            ref.once('value', function(snap) {
                res.json(snap.val());
            });
        });

    router.route('/firetaxis/:taxi_id')

        .get(function(req, res) {
            var ref = new Firebase(url + req.params.taxi_id);
            ref.once('value', function(snap) {
                res.json(snap.val());
            });
        })

        .put(function(req, res) {
            var ref = new Firebase(url + req.params.taxi_id);

            var onComplete = function(error) {
                if(error) {
                    console.log('Unable to update');
                } else {
                    res.json({ message: 'Taxi Updated!' });
                }
            };

            ref.update(
                {
                    'dropoffCoordinates': {
                        'latitude': req.body.dropoffCoordinates.latitude,
                        'longitude': req.body.dropoffCoordinates.longitude
                    },
                    'passenger_count': req.body.passenger_count,
                    'pickupCoordinates': {
                        'latitude': req.body.pickupCoordinates.latitude,
                        'longitude': req.body.pickupCoordinates.longitude
                    },
                    'tip_amount': req.body.tip_amount,
                    'total_amount': req.body.total_amount,
                    'trip_distance': req.body.trip_distance
                },
                onComplete
            );
        })

        // delete the taxi with this id (accessed at DELETE http://localhost:3000/api/taxis/:taxi_id)
        .delete(function(req, res) {
            var ref = new Firebase(url + req.params.taxi_id);

            var onComplete = function(error) {
                if(error) {
                    console.log('Unable to remove');
                } else {
                    res.json({ message: 'Taxi Removed!' });
                }
            };

            ref.remove(onComplete);
        });
}

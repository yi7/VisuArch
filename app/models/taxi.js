// app/models/taxi

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaxiSchema   = new Schema({
    passenger_count: { type: Number, required: true },
    trip_distance: { type: Number, required: true },
    pickupCoordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    dropoffCoordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    tip_amount: { type: Number },
    total_amount: { type: Number }
});

module.exports = mongoose.model('Taxi', TaxiSchema);

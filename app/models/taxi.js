// app/models/taxi

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaxiSchema   = new Schema({
    pickupCoordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    },
    dropoffCoordinates: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Taxi', TaxiSchema);

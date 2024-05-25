const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    ips: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Visit', visitSchema);

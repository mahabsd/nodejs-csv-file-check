const mongoose = require('mongoose');
const Schema = mongoose.Schema

let clientSchema = new Schema(
    {
        Sheet1: [{ type: String}]
    },
);

module.exports = mongoose.model('model', clientSchema);
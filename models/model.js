const mongoose = require('mongoose');
const Schema = mongoose.Schema

let modelSchema = new Schema(
    {
        colHeader: { type: String }
    },
);

module.exports = mongoose.model('model', modelSchema);
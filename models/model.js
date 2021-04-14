const mongoose = require('mongoose');
const Schema = mongoose.Schema

let modelSchema = new Schema(
    {
        LastName: { type: String, default: 'LastName' },
        FirstName: { type: String, default: 'FirstName' },
        Language: { type: String, default: 'Language' },
        PayId: { type: String, default: 'PayId' },
        PayId2: { type: String, default: 'PayId2' },
        PayId3: { type: String, default: 'PayId3' },
        others: [{ type: String }]
    },
);

module.exports = mongoose.model('model', modelSchema);
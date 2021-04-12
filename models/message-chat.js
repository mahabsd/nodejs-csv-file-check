const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    },
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('message', messageSchema);
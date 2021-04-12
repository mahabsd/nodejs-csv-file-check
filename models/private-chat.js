const mongoose = require('mongoose');

const privateChat = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'message' }]
},
{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('privateChat', privateChat);
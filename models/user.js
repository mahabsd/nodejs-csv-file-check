const mongoose = require('mongoose');
const Schema = mongoose.Schema

let userSchema = new Schema(

    {
        email: { type: String },
        password: { type: String },
        role: { type: String }
    },
    { timestamps: true })

module.exports = mongoose.model('User', userSchema);


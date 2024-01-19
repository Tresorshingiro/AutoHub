const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

const userCreate = mongoose.model('user', userSchema)

module.exports = userCreate;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
})

// Static signup method
userSchema.statics.signup = async function (role, username, email, password) {

    // validation
    if (!role || !username || !email || !password) {
        throw Error('All fields must be complete')
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    const emailExist = await this.findOne({email})
    const nameExist = await this.findOne({username})

    if (emailExist) {
        throw Error('Email already in use')
    }
    else if (nameExist) {
        throw Error('Username already in use')
    }
    else {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
    
        const user = await this.create({ role, username, email, password: hash })
    
        return user;
    }
}

module.exports = mongoose.model('User', userSchema)

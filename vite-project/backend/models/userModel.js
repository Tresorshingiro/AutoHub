const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator')

const userSchema = new Schema({
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
    role: {
        type: String,
        enum:['Reception', 'Operation', 'Accountant', 'Admin'],
        required: true
    },
    address: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    }
}, { timestamps: true });

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
        throw Error('Password not strong enough, (use 8+ digits of capital and small letters, number, and symbol)')
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

userSchema.statics.login = async function (role, email, password) {
    // validation
    if (!role) {
        throw Error('role field must be complete')
    }
    if (!email) {
        throw Error('email field must be complete')
    }
    if (!password) {
        throw Error('password field must be complete')
    }

    const user = await this.findOne({email})

    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user;
}

module.exports = mongoose.model('User', userSchema)

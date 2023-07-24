const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type:String,
        required: false
    },
    googleId: {
        type: String,
        required: false
    },
    userImage: {
        type: String,
        required: false,
        default: 'img'
    }
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
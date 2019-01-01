var mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name : String,
    login :  String,
    email : String,
    password : String
});

module.exports = mongoose.model('User', UserSchema, 'user');
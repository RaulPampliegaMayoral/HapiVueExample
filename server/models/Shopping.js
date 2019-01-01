var mongoose = require('mongoose');

const ShoppingSchema = mongoose.Schema({
    name : String,
    user : String,
    created : Date,
    modified : Date,
    items :  [{
        item : String,
        created : Date
    }] 
});

module.exports = mongoose.model('Shopping', ShoppingSchema, 'shopping');
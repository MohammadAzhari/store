const mongoose = require('mongoose');

const cart = mongoose.Schema({
    userCart : {
        type : String ,
        required : true 
    } ,
    itemId : {
        type : String ,
        required : true 
    }
}); 

module.exports = mongoose.model('cart' , cart);
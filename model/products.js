const mongoose = require('mongoose');

const product = mongoose.Schema({
    productName : {
        type : String ,
        required : true 
    } ,
    productPrice : {
        type : Number ,
        required : true 
    } ,
    productImg : {
        type : String ,
        required : true 
    } ,
});

module.exports = mongoose.model('products' , product);

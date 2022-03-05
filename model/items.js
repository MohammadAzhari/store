const mongoose = require('mongoose');

const item = mongoose.Schema({
    tit : {
        type : String ,
        required : true 
    } ,
    info : {
        type : Number ,
        required : true 
    } ,
    img : {
        type : String ,
        required : true 
    }
});

module.exports = mongoose.model('items' , item);
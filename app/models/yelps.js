// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema 
var yelpSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    going:{ type: Number },
    
    guestsNames:[String],
    
    guests:[String]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Yelps = mongoose.model('Yelp', yelpSchema);

// make this available to our Node applications
module.exports =Yelps;
const { ObjectID } = require('mongodb');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


const Snippet = new Schema({
    name:        String,
    creator:     ObjectID,
    uploaded:    Date,
    description: String,
    content:     String,
});


module.exports = db.model('Snippet', Snippet);

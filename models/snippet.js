var mongoose = require('mongoose');

var Schema = mongoose.Schema;


const Snippet = new Schema({
    name:        String,
    creator:     { type: Schema.Types.ObjectId, ref: 'User' },
    uploaded:    Date,
    description: String,
    content:     String,
});


module.exports = db.model('Snippet', Snippet);

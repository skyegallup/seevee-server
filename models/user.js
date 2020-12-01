const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;


const User = new Schema({
    username: String,
    password: String,  // stored as bcrypt hash
    email:    String,
});

// password hashing
User.pre('save', function(next) {
    console.log(this.username);
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        
        cb(null, isMatch);
    });
};

module.exports = db.model('User', User);

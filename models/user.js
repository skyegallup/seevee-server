const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;


const User = new Schema({
    username: String,
    password: String,  // stored as bcrypt hash
    email:    String,
});

// password hashing
User.pre('save', function(next) {
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

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        
        cb(null, isMatch);
    });
};

User.methods.createToken = function(cb) {
    let payload = {
        id: this.id,
        name: this.username,
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 }, cb);
}

module.exports = db.model('User', User);

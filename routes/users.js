var express = require('express');
var router = express.Router();

var User = require('../models/user');


router.post('/register', (req, res, next) => {
    User.create({
        username: req.body.username,
        password: req.body.password,  // hashed by model pre-save
        email:    req.body.email
    }, (err, user) => {
        if (err) return next(err);

        user.createToken((err, token) => {
            if (err) return res.status(500).json(err);

            res.json({
                token: "Bearer " + token
            });
        });
    })
});

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.status(400).json(err);

        if (!user) return res.status(400).json({ message: 'Incorrect username or password.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(400).json(err);

            if (isMatch) {
                user.createToken((err, token) => {
                    if (err) return res.status(500).json(err);

                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            } else {
                return res.status(400).json({ message: 'Incorrect username or password.' });
            }
        });
    });
});

module.exports = router;

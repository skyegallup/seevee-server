var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var User = require('../models/user');


router.post('/register', (req, res, next) => {
    User.create({
        username: req.body.username,
        password: req.body.password,  // hashed by model pre-save
        email:    req.body.email
    }, (err, doc) => {
        if (err) return next(err);
        res.send(doc);
    })
});

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return res.status(400).json(err);

        if (!user) return res.status(400).json({ message: 'Incorrect username or password.' });
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(400).json(err);

            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.username,
                };
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 31556926 }, (err, token) => {
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

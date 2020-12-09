var express = require('express');
var passport = require('passport');
var router = express.Router();

var Snippet = require('../models/snippet');


/**
 * Get all uploaded snippets, from newest to latest.
 */
router.get('/get', (req, res, next) => {
    Snippet.find({}).sort('-date').populate('creator', '_id username').exec((err, docs) => {
        if (err) return next(err);

        res.send(docs);
    });
});

/**
 * Get a single snippet by its ID.
 */
router.get('/get/:id', (req, res, next) => {
    Snippet.findById(req.params.id).populate('creator', '_id username').exec((err, doc) => {
        if (err) return next(err);

        res.send(doc);
    });
});

/**
 * Upload a new snippet. Requires auth.
 */
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Snippet.create({
        name:        req.body.name,
        creator:     req.user.id,
        uploaded:    Date.now(),
        description: req.body.description,
        content:     req.body.content,
    }, (err, doc) => {
        if (err) return next(err);

        res.send(doc);
    });
})

module.exports = router;

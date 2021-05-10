const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passport = require('passport');


//register: add new user
router.post('/add/', (req, res) => {

    user = new User(req.body)
    bcrypt.hash(user.password, 10, function (err, hash) {
        user.password = hash;
        user.save().then(item => {
            res.send('user added successfully ');
        }).catch(err => {
            console.log(err);
        });
    });

});

//get by Id
router.get('/user/:id', passport.authenticate('bearer', { session: false }), (req, res) => {

    User.findById(req.params.id).populate('role').then(data => {
        res.status(200).json(data);
    }).catch(err => res.status(400).json('Error: ' + err));
});


//get All users
router.get('/getAllusers', passport.authenticate('bearer', { session: false }), (req, res) => {

    User.find().populate('role').exec().then(function (users) {
        res.status(200).json(users);
    }).catch(err => res.status(400).json('Error: ' + err));
});

   

// sign in with passport
router.post('/login', (req, res) => {
    User.findOne({ "email": req.body.email }).then(user => {
        if (!user) {
            return res.status(404).json({
                message: "Email is not found.",
                success: false
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed."
                });
            }
            if (result) {
                const token = jwt.sign({
                    user: user
                }, 'RANDOM_TOKEN_SECRET',
                    {
                        expiresIn: "1d"
                    },
                );
                return res.status(200).json({
                    message: "You are Logged In.",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed."
            });
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;
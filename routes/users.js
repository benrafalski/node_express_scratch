const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { model } = require('mongoose');
const bcrypt = require('bcryptjs');

// bring in user model
let User = require('../models/user');
const { validate } = require('../models/user');

// register form 
router.get('/register', (req, res) => {
    res.render('register');
})

// register process
router.post('/register',
body('name', 'Name is required').notEmpty(),
body('email', 'Email is required').notEmpty(),
body('email', 'Email is not valid').isEmail(),
body('username', 'Username is required').notEmpty(),
body('password', 'Password is required').notEmpty(),
body('password2', 'Passwords do not match').custom((value, { req }) => value === req.body.password), 
(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('register', {
                errors: errors.array()
            });
        }else{
            let newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.username = username;
            newUser.password = password;

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save((err) => {
                        if(err){
                            console.log(err);
                            return;
                        }else{
                            console.log('a User was added!');
                            req.flash('success', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        }
                    })
                })
            })
        } 
})

router.get('/login', (req, res) => {
    res.render('login');
})

module.exports = router;
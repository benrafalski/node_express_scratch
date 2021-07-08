const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// bring in article model
let Article = require('../models/article');
const { validate } = require('../models/article');

// add route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add'
    }); // takes in the view as argument
})

// add submit post route
router.post('/add', 
body('title', 'title is required').notEmpty(),
body('author', 'author is required').notEmpty(),
body('body', 'body is required').notEmpty(),
(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('add_article', {
                title: 'Add Article',
                errors: errors.array()
            })
        }else{
            let article = new Article();
            article.title = req.body.title;
            article.author = req.body.author;
            article.body = req.body.body;
            article.save((err) => {
                if(err){
                    console.log(err);
                    return;
                }else{
                    console.log('an Article was added!');
                    req.flash('success', 'Article Added!');
                    res.redirect('/');
                }
            })
        }
    })

// load edit form
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, response) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: response
        });
    })
})

// update submit post route
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};
    Article.update(query, article, (err) => {
        if(err){
            console.log(err);
            return;
        }else{
            console.log('an Article was changed!');
            req.flash('success', 'Article Updated!');
            res.redirect('/');
        }
        
    })
})

// delete an article, uses ajax
router.delete('/:id', (req, res) => {
    let query = {_id: req.params.id};

    Article.remove(query, (err) => {
        if(err){
            console.log(err);
        }
        res.send('Success!');
    })
})

// get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, response) => {
        res.render('article', {
            article: response
        });
    })
})

module.exports = router; 
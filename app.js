const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

// connect to database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection

// check db connection
db.once('open', () => {
    console.log('connected to MongoDB!')
})

//check for db errors
db.on('error', () => {
    console.log(err);
})

// init app
const app = express();

// bring in models
let Article = require('./models/article');
const { validate } = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// express messages middleware
app.use(flash());
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
})


// home route
app.get('/', (req, res) => {
    // empty braces bring in all articles, this is the mongo find() function
    Article.find({}, (err, response) => {
        if(err){
            console.log(err);
        }else{
            // takes in the view as argument
            res.render('index', {
                title: 'Articles',
                articles: response
            });
        }
    }) 
})

// route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// start server
app.listen(3000, () => {
    console.log('server open on port 3000...');
})
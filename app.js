const path = require('path');
const express =  require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session  = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//Innitialise app variable
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Map global promise-get rid of promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: false})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Body Parser middleware
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//static folser configuration
app.use(express.static(path.join(__dirname, 'public')));
//Method override middleware
app.use(methodOverride('_method'));

//Express-session middleware
app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Configuring flash
app.use(flash());

//Global variables
app.use (function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    // Log in and register appearence
    res.locals.user = req.user || null;
    next();
});

//Handle bars middle ware(setting up engine to handle bars)
app.engine('handlebars', exphbs({ 
    defaultlayout: 'main'}));
app.set('view engine', 'handlebars');


//Route
app.get('/', (req, res) => {
    const title = 'Welcome to Home page';
    res.render('index', {
        title: title
    });  
});


app.get('/about', (req, res) => {   
    res.render('about');
});

//User Login
app.get('users/login',(req, res) => {
    res.send('Log in ');
});

//User Register
app.get('users/register',(req, res) => {
    res.send('Register');
}); 


//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// Setting up a listening port to 5000 
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});


//THE END.






















const path = require('path');
const express =  require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Innitialise app variable
const app = express();

//Map global promise-get rid of promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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



//Add idea route
app.get('/ideas/add', (req, res) => {   
    res.render('ideas/add');
});

//Process form
app.post('/ideas', (req, res) => { 
    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add details'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details:req.body.details
        });
    }
     else {
         const newUser = {
             title: req.body.title,
             details: req.body.details
         };
        new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
























const path = require('path');
const express =  require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Innitialise app variable
const app = express();

//Map global promise-get rid of promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', { useNewUrlParser: false})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Body Parser middleware
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));

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

//Idea index page
app.get('/ideas', (req, res) => { 
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        //Allows fetching from the database
        res.render('ideas/index', {
            ideas:ideas
        });         
    });
});



app.get('/about', (req, res) => {   
    res.render('about');
});

//Add idea route
app.get('/ideas/add', (req, res) => {   
    res.render('ideas/add');
});

//Edit idea route
app.get('/ideas/edit/:id', (req, res) => {   
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
         }); 
    });  
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
        .then( idea => { 
            res.redirect('/ideas');
        });
    }
});

//Edit form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new  values 
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        });
    });
});

//Delete Idea
app.delete('/ideas/:id', (req, res) => {
   Idea.remove({ _id:req.params.id})
   .then(()=> {
        res.redirect('/ideas');
   });
});

// Setting up a listening port to 5000 
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});

//  THE END






















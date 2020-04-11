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
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

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

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
























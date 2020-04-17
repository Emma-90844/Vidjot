if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb+srv://emma:ehelisemmy@cluster0-ensla.mongodb.net/test'};
} else {
    module.exports = {
        mongoURI:"mongodb://localhost/vidjot-dev"};
} 


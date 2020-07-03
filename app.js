const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const todoRouter = require('./routes/todoRouter')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const port = '3000';
const host = 'localhost';
//initiate the express
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// ===============connectivity with mongoose server===================
const url = 'mongodb://localhost:27017/todoapp';
mongoose.Promise =global.Promise
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Sucessfully connected to database..');
});
// ======================SET THE TEMPLATE ENGINE============================
app.engine('hbs',expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname:'hbs',
    defaultLayout:'index',
    partialsDir:__dirname+'/views/todo',
    layoutsDir:__dirname+'/views/'
}));

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));




// ===================ROUTES==================================
app.use('/',todoRouter)
app.use('/add',todoRouter)




// ==================LISTENING THE SERVER===================
app.listen(port,()=>{
    console.log(`The server is sucessfully running at http://${host}:${port}`);
});



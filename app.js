const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;
const User = require('./models/user');
const createSnippet = require('./routes/createSnippet');
const loginRegistration = require('./routes/loginRegistration');

const app = express();


// HANDLEBARS ================================================

app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


// SESSION ===================================================

app.use(
  session({
    secret: 'keyboard kitten',
    resave: false,
    saveUninitialized: true
  })
);


// BODY PARSER ===============================================

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// STATIC FILES ==============================================
app.use(express.static('public'));


// ROUTERS ===================================================
app.use('/', loginRegistration);
app.use('/createsnippet', createSnippet);


// HOME PAGE =================================================

// this middleware function will check to see if we have a user in the session.
// if not, we redirect to the login form.
const requireLogin = (request, response, next) => {
  console.log('request.user', request.user);
  if (request.user) {
    next();
  } else {
    console.log('Not logged in, redirecting...')
    response.redirect('/login');
  }
};

app.get('/', requireLogin, function(request, response, next) {

  User.find()
  .then(users => response.render('home', {users: users, user: request.user}))
  .catch(err => response.send('Booooooo'));
});


// LOG OUT ==================================================
app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});


// MONGOOSE CONNECT =========================================

mongoose
  // connect to mongo via mongoose
  .connect('mongodb://localhost:27017/newdb', { useMongoClient: true })
  // now we can do whatever we want with mongoose.
  // configure session support middleware with express-session
  .then(() => app.listen(3000, () => console.log('ready to roll!!')));

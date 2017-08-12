// PACKAGES
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

// MODELS
const User = require('./models/user');
const Snippet = require('./models/snippet');

// ROUTES
const createSnippet = require('./routes/createSnippet');
const loginRegistration = require('./routes/loginRegistration');
const searchSnippet = require('./routes/searchSnippet');

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
app.use('/search', searchSnippet)


// HOME PAGE =================================================

// Checks if user session exists, if not redirect to login
const requireLogin = (request, response, next) => {
  if (request.user) {
    next();
  } else {
    console.log('Not logged in, redirecting...')
    response.redirect('/login');
  }
};

app.get('/', requireLogin, function(request, response) {
  console.log(session);
  Snippet.find({createdBy: request.user.username})
    .then((snippets) => {
      response.render('home', {user: request.user, snippets: snippets})
    })
    .catch(err => response.send('Booooooo'));
});


// LOG OUT ==================================================

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});


// DELETE SNIPPET ===========================================

app.get('/deleteSnippet', (request, response) => {
  Snippet.findById(request.query.id)
    .remove()
    .then(() => response.redirect('/'));
});


// MONGOOSE CONNECT =========================================

mongoose
  .connect('mongodb://localhost:27017/newdb', { useMongoClient: true })
  .then(() => app.listen(3000, () => console.log('Code Snippet app started!')));

const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

//set up after sessions
app.use(flash());

// Register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

//import in the router
const landingRoutes = require('./routes/landing.js');
const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');

async function main() {

//make us of the landing page routes
app.use('/',landingRoutes);

app.use('/products', productRoutes)

app.use('/users', userRoutes)
}


main();

app.listen(3000, () => {
  console.log("Server has started");
});
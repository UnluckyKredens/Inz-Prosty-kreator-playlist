require("./config/db")
const express = require("express")
const path = require("path")
const handleBars = require("handlebars")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const userController = require("./controllers/userController")
const muzykaController = require("./controllers/muzykaController");
const autorRouter = require("./controllers/autorController")
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express()

const {
    allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access")

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use(logger('dev'));

app.use(cookieParser());

// DB Config
const db = require("./config/db").mongoURI;
const { mongoURI } = require("./config/db")


// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

var store = new MongoDBStore({
    uri: mongoURI,
    collection: 'sessionStore'
});
app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use(express.json())
app.get("/", (req, res) => {
    res.render("users/form", {
        viewTitle: "Wybierz"
    })
})

app.set("views", path.join(__dirname, "/views/"))
app.engine(
    ".hbs",
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handleBars),
        extname: ".hbs",
        defaultLayout: "mainLayout",
        layoutsDir: __dirname + "/views/layouts/"
    })
)
app.set("view engine", ".hbs")
app.listen(3000, () => {
    console.log("Express server started at port: 3000")
})

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {

    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use("/users", userController)
app.use("/muzyka", muzykaController)
app.use("/autor", autorRouter)

module.exports = app;
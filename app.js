const express = require('express');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');

const passport = require('./passport/setup');
const auth = require("./routes/auth");
require('dotenv').config()

const app = express();

const MONGO_URI = process.env.DB_CONNECTION;
console.log(MONGO_URI)

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true })
    .then(console.log(`MongoDB connected ${MONGO_URI}`))
    .catch(err => console.log(err));

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
    session({
        secret: "very secret this is",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: MONGO_URI })
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", auth);
app.get("/", (req, res) => res.send("Good monring sunshine!"));

app.listen(3000);
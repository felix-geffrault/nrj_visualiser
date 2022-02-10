const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const passport = require("./passport/setup");
const auth = require("./routes/auth");
const openCharge = require("./routes/OpenCharge");

admin.initializeApp();

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      debug: false,
      initImmediate: false,
      fallbackLng: "en",
      preload: ["en", "fr"],
      backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json",
        addPath: "./locales/{{lng}}/{{ns}}.json",
      },
    });

const MONGO_URI = functions.config().mongodb.url;
mongoose
    .connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(console.log("MongoDB connected"))
    .catch((err) => console.log(err));


const app = express();
// Bodyparser middleware, extended false does not allow nested payloads
app.use(middleware.handle(i18next));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(
    session({
      secret: functions.config().passport.sessionsecret,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({mongoUrl: MONGO_URI}),
    }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post("/locales/:lng/:ns", middleware.missingKeyHandler(i18next));
app.use("/auth", auth);
app.use("/OpenCharge", openCharge);

app.use( (req, res, next) => {
  res.status(404);
  const notFound = req.t("page.not.found");

  // respond with json
  if (req.accepts("json")) {
    res.json({error: notFound});
    return;
  }

  // default to plain-text. send()
  res.type("txt").send(notFound);
});

exports.app = functions.https.onRequest(app);

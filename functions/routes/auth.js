const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const passport = require("passport");

router.post("/login", (req, res, next) => {
  passport.authenticate("login", function(err, user, info) {
    if (err) {
      return res.status(400).json({errors: err});
    }
    if (!user) {
      return res.status(400).json({errors: req.t(info.message)});
    }
    req.logIn(user, function(err) {
      if (err) return res.status(400).json({errors: err});
      return res.status(200).json({success: `Logged in ${user.id}`});
    });
  })(req, res, next);
});

router.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) return res.status(400).json({errors: err});
    if (!user) return res.status(400).json({errors: req.t(info.message)});
    req.logIn(user, (err) => {
      if (err) return res.status(400).json({errors: err});
      return res.status(200).json({success: `Registered with ${user.id}`});
    });
  })(req, res, next);
});

module.exports = router;

/*
export function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}*/

// /user routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

router.get("/register", async (req, res) => {
  res.render("users/register.ejs");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) return next(err);
        req.flash("success", `${username}, welcome to YelpCamp!`);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You are logged out.");
  res.redirect("/campgrounds");
});

module.exports = router;

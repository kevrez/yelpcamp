// /user routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
// const userSchema = require("");

router.get("/register", async (req, res) => {
  res.render("users/register.ejs");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const newUser = await User.register(user, password);
      req.flash("success", `${username}, Welcome to YelpCamp!`);
      res.redirect("/campgrounds");
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
    res.redirect("/campgrounds");
  }
);

module.exports = router;

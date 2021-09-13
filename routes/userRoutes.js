// /user routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");

const controller = require("../controllers/usersController");

router.get("/register", controller.renderRegister);

router.post("/register", catchAsync(controller.register));

router.get("/login", controller.renderLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  controller.login
);

router.get("/logout", controller.logout);

module.exports = router;

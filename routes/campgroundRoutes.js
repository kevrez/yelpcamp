// /campground routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");

const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in to do that.");
    res.redirect("/login");
  } else {
    res.render("campgrounds/new.ejs");
  }
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("author")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      });
    if (!campground) {
      req.flash("error", "Can't find that campground.");
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/show.ejs", { campground });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit.ejs", { campground });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground.");
    res.redirect(`campgrounds/${campground._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    req.flash("success", "Successfully updated campground.");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;

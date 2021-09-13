// /campground routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

const controller = require("../controllers/campgroundController");

router.get("/", catchAsync(controller.index));

router.get("/new", isLoggedIn, controller.renderNewForm);

router.get("/:id", catchAsync(controller.showCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(controller.renderEditForm)
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(controller.createCampground)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(controller.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(controller.deleteCampground)
);

module.exports = router;

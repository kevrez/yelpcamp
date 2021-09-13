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

router
  .route("/")
  .get(catchAsync(controller.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(controller.createCampground)
  );

router.get("/new", isLoggedIn, controller.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(controller.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(controller.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(controller.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(controller.renderEditForm)
);

module.exports = router;

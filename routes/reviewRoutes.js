// review routes
"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const controller = require("../controllers/reviewsController");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(controller.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(controller.deleteReview)
);

module.exports = router;

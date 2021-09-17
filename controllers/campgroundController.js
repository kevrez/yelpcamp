"use strict";

const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxClient = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxClient({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in to do that.");
    res.redirect("/login");
  } else {
    res.render("campgrounds/new.ejs");
  }
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocodingClient
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => {
    return { url: f.path, filename: f.filename };
  });
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground.");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit.ejs", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );

  // Add images if any
  const imgs = req.files.map((f) => {
    return { url: f.path, filename: f.filename };
  });
  campground.images.push(...imgs);

  // Delete images if any
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await campground.save();
  req.flash("success", "Successfully updated campground.");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
};

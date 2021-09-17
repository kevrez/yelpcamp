"use strict";

const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const User = require("./user");

// https://res.cloudinary.com/dqihgrxvp/image/upload/v1631834245/YelpCamp/bajo903fjbcfk1rwqrej.jpg'
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_fill,w_125,h_125");
});

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);

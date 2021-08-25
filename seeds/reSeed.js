"use strict";

const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo database connected.");
  })
  .catch((err) => {
    console.log("Mongo connection error:");
    console.log(err);
  });

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad quam ducimus nobis consequuntur, tempore, pariatur iusto sit qui, omnis eligendi corporis praesentium! Non maiores laborum magni inventore nihil obcaecati earum!",
      price,
    });
    await c.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Mongo database disconnected.");
});

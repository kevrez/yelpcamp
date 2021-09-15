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
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad quam ducimus nobis consequuntur, tempore, pariatur iusto sit qui, omnis eligendi corporis praesentium! Non maiores laborum magni inventore nihil obcaecati earum!",
      price,
      author: "613ca0f02b9b19f9681ed6a2",
      images: [
        {
          url: "https://res.cloudinary.com/dqihgrxvp/image/upload/v1631676077/YelpCamp/qtdrb3m6vn4lj6clk470.jpg",
          filename: "YelpCamp/qtdrb3m6vn4lj6clk470",
        },
        {
          url: "https://res.cloudinary.com/dqihgrxvp/image/upload/v1631676078/YelpCamp/emqjfjva2ynyuyabgyoi.jpg",
          filename: "YelpCamp/emqjfjva2ynyuyabgyoi",
        },
        {
          url: "https://res.cloudinary.com/dqihgrxvp/image/upload/v1631676079/YelpCamp/p0v9zkrxupgc3wpflqgn.jpg",
          filename: "YelpCamp/p0v9zkrxupgc3wpflqgn",
        },
      ],
    });
    await c.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log("Mongo database disconnected.");
});
